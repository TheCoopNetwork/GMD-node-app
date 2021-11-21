const log = require('electron-log');
let electronapp = {};
electronapp.mainElectron = async (my_url, osAbstraction)=>{
    log.info("starting mainElectron");
    const quitDialogOpts = {
		title : 'Quit?',
		type : 'question',
		buttons : ['Yes, I want to quit','Minimize to Tray','Cancel'],
		message : 'Keeping the node running by minimizing it in the tray helps COOP Network to maintain a secure and decentralized environment. \n\n\n Are you sure you want to quit?'
	};
    const { app, BrowserWindow, dialog } = require('electron');
    const sysTray = require('./tray');
    app.quitting=false;	

    const createWindow = async () => {
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
        let autoStartEnabled = await osAbstraction.isAutoStartEnabled();
        sysTray.init(
            osAbstraction.getLogoFileName(),
            autoStartEnabled,
            "Connected to node: "+ my_url,
            ()=>{mainWindow.show()},
            ()=>{mainWindow.reload()},
            (checked)=>{
                osAbstraction.setAutostart(checked);
            },
            ()=>{log.info('quiting...');
                osAbstraction.killBackend();
                app.quitting = true;
                app.quit();
            }
        )
        log.debug("Loading url now "+my_url);
        mainWindow.loadURL(my_url);
    };

    //app.on('ready', createWindow);
    app.whenReady().then(() => {
        log.info("====== app.whenReady -> createWindow");
        createWindow();
    });

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
}

module.exports = electronapp;