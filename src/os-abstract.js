
let OSLayer = {}

const log = require('electron-log');

const path = require('path');


let os = require('os');
if(os.platform() == 'win32'){
    OSLayer.osAbstraction = require('./win');
} else if (os.platform() == 'darwin'){
    OSLayer.osAbstraction = require('./macos');
} else if (os.platform == 'linux') {
    //TODO
    OSLayer.osAbstraction = require('./macos');
} else {
    log.error("unrecognized platform "+ os.platform());
    process.exit(3);
}

var AutoLaunch = require('auto-launch');
var gmdNodeLauncher = new AutoLaunch({
    name: 'gmd-node',
    isHidden: true,
    path: OSLayer.osAbstraction.getBinPath()});

OSLayer.osAbstraction.isAutoStartEnabled = async ()=> {
    return await gmdNodeLauncher.isEnabled();
}

OSLayer.osAbstraction.setAutostart = (enable) => {
    try {
        log.info("Set autostart to "+enable);
        if(enable){
            gmdNodeLauncher.enable();
        } else {
            gmdNodeLauncher.disable();
        }
    } catch(e){
        log.error("Cannot autostart "+ JSON.stringify(e));
    };
};

OSLayer.osAbstraction.initFile = (cwd)=> {
    log.debug('initFile cwd param: '+cwd);
    const initFilePath = require('path').join(cwd, '..','gmd-node', 'init');
    const fs = require('fs');
    log.debug('osAbstraction.initFile working directory=' +process.cwd()+' initFilePath='+initFilePath);
    if(fs.existsSync(initFilePath)) {
        log.debug('init file exists');
        try { 
            var filedata= fs.readFileSync(initFilePath);
            if(filedata.indexOf('initialized=0') >= 0){
                log.debug("not initialized");
                fs.writeFileSync(initFilePath, 'initialized=1', 'utf-8'); 
                OSLayer.osAbstraction.setAutostart(true);
                log.info("set autostart true");
            }			
        } catch(e) { 
            log.warn('Cannot parse \'init\' file. error: '+e);
        }
    }
}


module.exports = OSLayer;
