const { app, BrowserWindow, dialog, Tray, Menu } = require('electron');
if (require('electron-squirrel-startup')) return app.quit(); //do not restart multiple times during installer
app.quitting=false;
const path = require('path');
const { spawn, exec } = require('child_process');
const log = require('electron-log');
var my_url = 'http://localhost:6876';
let tray = null;

var AutoLaunch = require('auto-launch');
try {
	var gmdNodeLauncher = new AutoLaunch({
		name: 'gmd-node',
		isHidden: true,
		path: require.resolve(path.join(__dirname, '..', '..', 'GMD-Node.exe'))
	});
	gmdNodeLauncher.enable();
} catch(e){
	log.error("Cannot autostart "+ JSON.stringify(e));
};

const killBackend = () => {
	exec("taskkill /f /im gmd-jvm.exe");
};

var winUtil = {
	bat: require.resolve(path.join(__dirname, 'gmd-node', 'start.bat'))
};


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit()
}

const createWindow = () => {

	log.warn('Starting bat from:' + winUtil.bat);
	var ls = spawn(winUtil.bat);


	ls.stdout.on('data', function (data) {
	log.verbose('stdout: ' + data);
	});

	ls.stderr.on('data', function (data) {
	log.error('stderr: ' + data);
	});

	ls.on('exit', function (code) {
	log.info('child process exited with code ' + code);
	});

	const mainWindow = new BrowserWindow({
		width: 1400,
		height: 800,
		title: "GMD-Node " + my_url,
		icon: __dirname + '/logo.ico',
		frame: true,
		autoHideMenuBar: true
	});

	mainWindow.on('close', function(e){
		log.debug('closing window');
		let options  = {
			title: "Quit?",
			type: "question",
			buttons: ["Yes, I want to quit","Minimize to Tray","Cancel"],
			message: "Keeping the node running by minimizing it in the tray helps COOP Network to maintain a secure and descentralized environment. \n\n\n Are you sure you want to quit?"
		}
		if(app.quitting!=true){
			let resp = dialog.showMessageBoxSync(this, options);
			log.debug('Quit dialog response=' + resp);			
			if(resp==0){
				log.info('quiting...');	
				killBackend();
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

	// and load the index.html of the app.
	// mainWindow.loadFile(path.join(__dirname, 'index.html'));
	tray = new Tray(__dirname + '/logo.ico');

	
	const contextMenu = Menu.buildFromTemplate([
		{ 
			label: 'Open', 
			click: function() {
				mainWindow.show();
			}
		},
		{ 
			label: 'Refresh', 
			click: function() {
				mainWindow.reload();
			}
		},
		{ 
			label: 'Quit', 
			click: function() {
				app.isQuiting = true;
				app.quit();
			}
		},
		// { 
		// 	label: 'Autostart', 
		// 	type: 'checkbox', 
		// 	checked: true,
		// 	click: function() {}
		// }
		
	]);
	tray.setContextMenu(contextMenu);
	tray.setToolTip("Connected to node: "+ my_url)
	tray.on('click', ()=> {
		mainWindow.show();
	}); 

	
	mainWindow.loadURL(my_url);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


app.on('before-quit', function(evt) {
	log.info('before quit.');
	tray.icon =  null;
	tray.destroy();
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
