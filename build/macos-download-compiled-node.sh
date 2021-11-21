#!/bin/sh

cd ../gmd-node
rm -rf GMD
downloadname=gmd-node-standalone
rm $downloadname.zip
wget https://node.thecoopnetwork.io:8443/$downloadname.zip
unzip $downloadname.zip

cd GMD/GMD-2*
mv * ../../../gmd-node/
cd ../..

rm -rf GMD
rm -f $downloadname.zip
rm -f start.sh start.bat
rm -rf logs

conffile=./conf/nxt.properties

echo nxt.apiServerHost=localhost>$conffile
echo nxt.myPlatform=MacOS App>>$conffile

echo initialized=0>./init
