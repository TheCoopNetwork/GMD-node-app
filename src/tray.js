const sysTray = {}
const callback = {}
let tray = null;
const {Tray, Menu, shell} = require('electron');
const log = require('electron-log');

sysTray.init = (icon, isAutoStart, tooltip, show, reload, autostart, quit) => {
    callback.show = show;
    callback.reload = reload;
    callback.autostart = autostart;
    callback.quit = quit;
    const path = require('path');
    tray = new Tray(path.join(__dirname,icon));
    tray.setToolTip(tooltip);
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Open', 
            click: ()=>{callback.show()}
        },
        { 
            label: 'Refresh', 
            click: ()=>{callback.reload()}
        },
        {
            id: 'autostart',
            label: 'Auto-Start',
            type: 'checkbox',
            click: (menuItem)=>{
                var util = require('util')
                log.info("===="+util.inspect(menuItem));
                callback.autostart(menuItem.checked);
            }
        },
        { 
            label: 'Github page', 
            click: ()=>{
                shell.openExternal('https://github.com/CoopNetwork/GMD-node-app');
            }
        },
        { 
            label: 'Quit', 
            click: ()=>{callback.quit()}
        },

    ]);
    if (isAutoStart){
        contextMenu.getMenuItemById('autostart').checked = true;
    } else {
        contextMenu.getMenuItemById('autostart').checked = false;
    }
    tray.setContextMenu(contextMenu);
    
    tray.on('click', ()=> {
        callback.show();
    });
}

sysTray.destroy = ()=>{
    if(tray){
	    tray.destroy();
    }
}

module.exports = sysTray;