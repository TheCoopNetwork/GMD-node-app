const { app, BrowserWindow, dialog } = require('electron');
if (require('electron-squirrel-startup')) return app.quit(); //do not restart multiple times during installer
app.quitting=false;
const quitDialogOpts = {
	title : 'Quit?',
	type : 'question',
	buttons : ['Yes, I want to quit','Minimize to Tray','Cancel'],
	message : 'Keeping the node running by minimizing it in the tray helps COOP Network to maintain a secure and descentralized environment. \n\n\n Are you sure you want to quit?'
};

const log = require('electron-log');
const sysTray = require('./tray');
const my_url = 'http://localhost:6876';
let tray = null;


const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit()
}

let os = require('os');
let osAbstraction = null;
if(os.platform() == 'win32'){
	osAbstraction = require('./win');
} else if (os.platform() == 'darwin'){
	osAbstraction = require('./macos');
} else if (os.platform == 'linux') {
	//TODO
	osAbstraction = require('./macos');
} else {
	log.error("unrecognized platform "+ os.platform());
	app.quitting = true;
	app.quit();
}

osAbstraction.setAutostart();
osAbstraction.startBackend();

waitUntilBackendStarted = async ()=> {
    let initFinished=false;	
    const http = require('http');
    
    log.debug("while..........")
	while (initFinished == false){
		log.debug("inside while");

		http.get(my_url+"/index.html", function (res) {
			log.info(my_url + " is accessible; creating browser window")			  
			initFinished = true;
		}).on('error', async function(e) {
			log.debug(my_url + " not yet accessible. waiting to initialize");	  
		});
		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}


const createWindow = async () => {
	await waitUntilBackendStarted();
	const mainWindow = new BrowserWindow({
		width: 1400,
		height: 800,
		title: "GMD-Node " + my_url,
		icon: __dirname + osAbstraction.getLogoFileName(),
		frame: true,
		autoHideMenuBar: true
	});


	mainWindow.on('close', function(e) {
		log.debug('closing window');
		if(app.quitting!=true){
			let resp = dialog.showMessageBoxSync(this, quitDialogOpts);
			log.debug('Quit dialog response=' + resp);			
			if(resp==0){
				log.info('quiting...');	
				osAbstraction.killBackend();
				app.quitting=true;
				app.quit();
			} else {
				e.preventDefault();
				if (resp == 1) {
					mainWindow.hide();
				}
			}
		}
	});

	mainWindow.on('minimize',function(event){
		event.preventDefault();
		mainWindow.hide();
	});
	
	sysTray.init(
		osAbstraction.getLogoFileName(),
		"Connected to node: "+ my_url,
		()=>{mainWindow.show()},
		()=>{mainWindow.reload()},
		()=>{log.info('quiting...');
			osAbstraction.killBackend();
			app.quitting = true;
			app.quit();
		}
	)
	log.debug("Loading url now "+my_url);
	mainWindow.loadURL(my_url);
};

app.on('ready', createWindow);


app.on('before-quit', function(evt) {
	log.info('before quit.');
	sysTray.destroy();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  log.info('window closed')
  if (process.platform !== 'darwin') {
    //app.quit();
  }
});

app.on('activate', () => {
  log.debug("activate window. BrowserWindow.getAllWindows()=" + BrowserWindow.getAllWindows());
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});