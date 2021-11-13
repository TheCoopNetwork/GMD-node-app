const sysTray = {}
const callback = {}
let tray = null;
const {Tray, Menu, shell} = require('electron');

sysTray.init = (icon, tooltip, show, reload, quit) => {
    callback.show = show;
    callback.reload = reload;
    callback.quit = quit;
    tray = new Tray(__dirname + icon);
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
    tray.setContextMenu(contextMenu);
    
    tray.on('click', ()=> {
        callback.show();
    });
}

sysTray.destroy = ()=>{
    tray.icon =  null;
	tray.destroy();
}

module.exports = sysTray;