# GMD Node Windows Application #
It is the GMD Node App for Windows packaged in a simple "one-click" installer containing all necessary dependencies.  
We are working on version for MacOS as well.  



1. Download the installer file from here: https://node.thecoopnetwork.io:8443/GMD-Node-1.0.0/%20Setup.exe (as alternative this installer can be built using the instructions in the 2nd part of this readme file)
2. Execute installer "GMD-Node-1.0.0 Setup.exe".
3. Once the installation is finished a shortcut called "GMD-Node" is created in Windows Start Menu, another shortcut on the Desktop and application is set to auto-start on PC start. Also, appliation will start automatically when installation is finished.

## Important notes ##
1. Before installing this GMD node Windows application you need to make sure that any **previous GMD node running on same PC is** already **stopped**.  
2. **When starting again the app**, use the shortcuts from Start Menu or from the desktop, **do not execute again the installer "GMD-Node-1.0.0 Setup.exe".**
3. To **disable autostart** open Task Manager (shortcut Ctrl+Shift+Esc) -> Go to "Startup" tab -> Disable "Update" app published by Github.  
4. To **uninstall the node**, use standard Windows approach: Control Panel-> Programs and Features -> Select "GMD Node" -> Uninstall
5. If the node has issues, please start a discussion here https://github.com/CoopNetwork/GMD-blockchain/discussions and attach the application logs. **Logs can be found in "%APPDATA%\GMD-Node\logs"** folder.
6. Installation directory is "%LOCALAPPDATA%\gmd_node". **If node needs to be reinitialized** (if for whatever reason the node has a blockchain desychronized from the rest of the network, or local database was corrupted, and it passed more than 1 hour without the node resynchrnizing itself) than you need to:
  - Stop the node
  - **Delete the database folder "%LOCALAPPDATA%\gmd_node\app-1.0.0\resources\app\gmd-node\nxt_db"**
  - Wait 10 minutes from the moment node was stopped (This is necessary so the possible 10 minute blacklist wear off)
  - Start the node and wait for blockhain to be downloaded again. Depending on the blockchain length this operation may take 15 to 90 minutes.
 6. Secret passphrase can safely be used with this Node App as it is nevever sent over the network. 



## Developer instructions ##
For the moment this only works on Windows. For MacOS work in progress

Steps:
1. In this directory create another directory called gmd-node and copy standalone build content in it. Standalone build can be created by compiling https://github.com/CoopNetwork/GMD-blockchain or by downloading it directly from https://node.thecoopnetwork.io:8443/gmd-node-standalone.zip. Files and directories should be directly in "gmd-node" dir (CoopNetwork.jar, start.bat, start.sh, conf, html, lib)
2. Create custom JRE and copy it to gmd-node, under directory jre-for-gmd (create it).
``` 
jdeps -cp lib\*;conf;CoopNetwork.jar --multi-release 9 --ignore-missing-deps --list-deps CoopNetwork.jar
   java.base
   java.compiler
   java.desktop
   java.instrument
   java.logging
   java.management
   java.naming
   java.scripting
   java.security.jgss
   java.sql
   java.transaction.xa
   java.xml
jlink --add-modules "java.base,java.compiler,java.desktop,java.instrument,java.logging,java.management,java.naming,java.scripting,java.security.jgss,java.sql,java.transaction.xa,java.xml" --output jre-for-gmd
```
Rename `jre-for-gmd\bin\javaw.exe` to `jre-for-gmd\bin\gmd-jvm.exe`  
[Optional] Command line to test new JRE: `jre-for-gmd\bin\gmd-jvm.exe -cp lib\*;conf;CoopNetwork.jar -Dnxt.runtime.dirProvider=nxt.env.DefaultDirProvider nxt.Nxt`

3. npm install
4. [Optional] To run in dev environment use `npm start`.
5. To create self extracting installer run `npm run make`. Installer will be created in out/make/...
