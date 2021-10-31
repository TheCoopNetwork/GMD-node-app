const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
var bat = require.resolve(path.join(__dirname, 'gmd-node', 'start.bat'));
const log = require('electron-log');
var my_url = 'http://localhost:6876';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  //child_process.exec(path.join(__dirname, 'backend', 'start.bat'), function(error, stdout, stderr) {
  //  console.log(stdout);
  //});
  log.warn('=-========----=========starting bat from:' + bat);
  var ls = spawn(bat);
  
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
	title: "GMD-Node" + my_url,
	icon: __dirname + '/logo.ico',
	frame: true,
	autoHideMenuBar: true
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  mainWindow.loadURL(my_url);


};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  log.info('window closed')
  if (process.platform !== 'darwin') {
    app.quit();
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
