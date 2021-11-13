const osAbstraction = {};
const { spawn, execSync } = require('child_process');
const log = require('electron-log');

const path = require('path');
var start_path = path.join(__dirname, 'gmd-node');

osAbstraction.setAutostart = () => {
    var AutoLaunch = require('auto-launch');
    try {
        var gmdNodeLauncher = new AutoLaunch({
            name: 'gmd-node',
            isHidden: true,
            path: "/Applications/GMD-Node.app"});
        gmdNodeLauncher.enable();
    } catch(e){
        log.error("Cannot autostart "+ JSON.stringify(e));
    };
};

osAbstraction.killBackend = () => {
    log.info("Killing backend...");
    execSync("pkill gmd-jvm");
    log.info('Backend stopped');
};
waitPreviousProcessToFinish=()=>{
    let waiting = true;
    let count = 45;
    while (waiting && count-->0) {
         try {
             execSync("pgrep gmd-jvm && sleep 2");
             log.debug("waiting for backend to shutdown 2s; countdown="+count);
         } catch(e){
             waiting = false;
             log.debug("waiting done");
         }
         
    }
}

osAbstraction.startBackend = () => {
    log.info('Starting from:' + start_path);
    waitPreviousProcessToFinish();

    process.chdir(start_path);
    try {
        ls = spawn('jre-for-gmd-mac/bin/gmd-jvm', ["-jar", "CoopNetwork.jar", "-cp", "lib\*", "-cp", "conf", "-Dnxt.runtime.dirProvider=nxt.env.DefaultDirProvider", "nxt.Nxt"]);
    } catch(e){
        log.error('Cannot start jvm.');
        osAbstraction.killBackend();
    }

	ls.stdout.on('data', (data)=>{log.verbose("|"+data)});
	ls.stderr.on('data', (data)=>{log.info(">"+data)});
	ls.on('exit', (code)=>{log.info('child process exited with code ' + code)});
};

osAbstraction.getLogoFileName = () => {
    return '/resources/logo.png';
}


module.exports = osAbstraction;