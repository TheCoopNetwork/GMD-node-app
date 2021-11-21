//this module contains MacOS specifics (e.g. binary path, macos resources, executing and stopping other processes)

const osAbstraction = {};
const { spawn, execSync } = require('child_process');
const log = require('electron-log');
var start_path = require('path').join(__dirname,'..','gmd-node');

osAbstraction.getBinPath = () => {
    return '/Applications/GMD-Node.app/Contents/MacOS/GMD-Node';
}

osAbstraction.killBackend = () => {
    log.info("Killing backend...");
    try {
        execSync("pkill gmd-jvm");
    } catch (error) {
        log.warn('Exception kill process: '+ error);
    }
    log.info('Backend stopped');
};
waitPreviousProcessToFinish=()=>{
    let waiting = true;
    let count = 60;
    while (waiting && count-->0) {
        if(count==40){
            osAbstraction.killBackend();
        }
         try {
             execSync("pgrep gmd-jvm && sleep 2");
             log.debug("waiting for backend to shutdown 2s; countdown="+count*2);
         } catch(e){
             waiting = false;
             log.debug("waiting done error="+e);
         }
         
    }
}

osAbstraction.startBackend = () => {
    log.info('Starting from:' + start_path);
    waitPreviousProcessToFinish();
    log.debug('chdir to '+start_path);
    process.chdir(start_path);
    try {
        log.debug('spawn gmd-jvm');
        ls = spawn('jre-for-gmd-mac/bin/gmd-jvm', ["-jar", "CoopNetwork.jar", "-cp", "lib\*", "-cp", "conf", "-Dnxt.runtime.dirProvider=nxt.env.DefaultDirProvider", "nxt.Nxt"]);
        log.debug('spawn gmd-jvm done');
    } catch(e){
        log.error('Cannot start jvm.');
        osAbstraction.killBackend();
    }

	ls.stdout.on('data', (data)=>{log.verbose("|"+data)});
	ls.stderr.on('data', (data)=>{log.info(">"+data)});
	ls.on('exit', (code)=>{log.info('child process exited with code ' + code)});
};

osAbstraction.getLogoFileName = () => {
    return '../resources/logo.png';
}


module.exports = osAbstraction;