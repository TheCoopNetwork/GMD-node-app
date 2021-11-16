@echo off
cd ../gmd-node
wget https://node.thecoopnetwork.io:8443/gmd-node-standalone.zip
powershell Expand-Archive gmd-node-standalone.zip

cd gmd-node-standalone\GMD\GMD-2*
xcopy /s . ..\..\..\ /Y
cd ..\..\..
set conffile=.\conf\nxt.properties
echo %conffile%
echo nxt.apiServerHost=localhost>%conffile%
echo nxt.myPlatform=Windows App>>%conffile%

del start.sh
del start.bat
del gmd-node-standalone.zip
rmdir /S /Q .\gmd-node-standalone