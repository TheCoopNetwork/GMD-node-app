# GMD Node Windows/MacOS Application #
This is the GMD Node App for Windows x64 and MacOS. It has a simple installer, no dependency and runs both the node and the user interface.

## Important notes for both Windows and MacOS apps:
1. When starting the app for the first time it may take up to 1 minute until the node initializes and the UI appears, please wait. Also on first run, until blockchain is download and synchronized with the other nodes, some warnings might be seen in the user interface. This is normal until node is synchronized (15 to 90 minutes or more, depending on the blockchain length).
2. Before installing this GMD node application you need to make sure that any **previous GMD node running on same PC is** already **stopped**.  
3. If the node has issues, please start a discussion here https://github.com/CoopNetwork/GMD-blockchain/discussions and attach the application logs. Logs location is mentioned in the Windows application notes and MacOS application notes respectively.
4. Secret passphrase can safely be used with this Node App as it is never sent over the network. 
5. If for whatever reason the node holds a blockchain desynchronized from the rest of the network, or local database was corrupted and it passed more than 1 hour without the node resynchronizing by itself) then you need to:
   - Stop the node
   - **Delete the database folder** nxt_db in the path specified in the Windows application notes, respectively MacOS application notes.
   - Wait 10 minutes from the moment node was stopped (This is necessary so the possible 10 minute blacklist wear off)
   - Start the node and wait for blockchain to be downloaded again. Depending on the blockchain length this operation may take 15 to 90 minutes.
6. To **disable autostart** use System tray menu.

  

## Instructions for Windows x64 ##

1. Download the installer file from here: [GMD-Node-1.0.1-b2 Setup.exe](https://node.thecoopnetwork.io:8443/GMD-Node-1.0.1-b2%20Setup.exe) (as alternative this installer can be built using the instructions in the 2nd part of this readme file)
2. Execute installer "GMD-Node-1.0.1-b2 Setup.exe".
3. Once the installation is finished a shortcut called "GMD-Node" is created in Windows Start Menu, another shortcut on the Desktop and application is set to auto-start on PC start. Also, application will start automatically when installation is finished.

- ### **Application notes for Windows** version ###

  1. **When starting again the app**, use the shortcuts from Start Menu or from the desktop, **do not execute again the one-click installer "GMD-Node-<version> Setup.exe".**
  2. To **uninstall the node**, use standard Windows approach: Control Panel-> Programs and Features -> Select "GMD Node" -> Uninstall
  3. **Logs can be found in "%APPDATA%\GMD-Node\logs"** folder.
  4. Installation directory is "%LOCALAPPDATA%\gmd_node". **If node needs to be reinitialized** delete the database folder found in **"%LOCALAPPDATA%\gmd_node\app-<version>\resources\app\gmd-node\nxt_db"**
   

## Instructions for MacOS ##
1. Download zip installer: [GMD-Node-darwin-x64-1.0.1-b2.zip](https://node.thecoopnetwork.io:8443/GMD-Node-darwin-x64-1.0.1-b2.zip)
2. Extract contents called GMD-Node
3. Move GMD-Node to Applications directory.

### **Application notes for MacOS** version ###
1. To uninstall the node, just delete GMD-Node from Applications directory.
2. **If node needs to be reinitialized** delete the database folder: **"/Applications/GMD-Node.app/Contents/Resources/app/gmd-node/nxt_db"**
3. Logs can be found in ~/Library/Logs/GMD-Node/


## Build instructions:
#### Prerequisites ####
  - NodeJS, wget
#### Steps: ####
`npm run clean-build`  
This command will download all dependencies, compile and build the installers.  
Installers will be found in out/make/ directory.
After first build, application can be run locally for debugging purposes (without a need to execute the installer) by executing 
`npm start`. 
