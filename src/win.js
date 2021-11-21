const osAbstraction = {};
const { spawn, execSync } = require('child_process');
const log = require('electron-log');
const { dirname } = require('path');

const path = require('path');
var start_path = path.join(__dirname, '..', 'gmd-node');


osAbstraction.getBinPath = ()=>{
    let exe='';
    log.info('getBinPath dirname='+__dirname);
    try {
        exe = require.resolve(path.join(__dirname, '..', '..', '..', 'GMD-Node.exe'));
    } catch (e) {
        log.warn('could not find GMD-Node.exe. Needed for to set OS autostart. Error: '+e);
    }
    return exe;
}

osAbstraction.killBackend = () => {
    log.info("Killing backend...");
    try {
        execSync("taskkill /f /im gmd-jvm.exe");
    } catch(e){
        log.error("failed taskkill command");
    }
};

osAbstraction.startBackend = () => {
    log.info('Starting from:' + start_path);
    process.chdir(start_path);
    try {
        ls = spawn('jre-for-gmd-win/bin/gmd-jvm', ["-jar", "CoopNetwork.jar", "-cp", "lib\*", "-cp", "conf", "-Dnxt.runtime.dirProvider=nxt.env.DefaultDirProvider", "nxt.Nxt"]);
    } catch(e){
        log.error('Cannot start jvm.');
        osAbstraction.killBackend();
    }

	ls.stdout.on('data', (data)=>{log.verbose("|"+data)});
	ls.stderr.on('data', (data)=>{log.info(">"+data)});
	ls.on('exit', (code)=>{log.info('child process exited with code ' + code)});
};

osAbstraction.getLogoFileName = () => {
    return '../resources/logo.ico';
}

module.exports = osAbstraction;