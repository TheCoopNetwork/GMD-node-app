# TODO #
User instructions

## Developer instructions ##
For the moment this only works on Windows. For MacOS work in progress

Steps:
1. Copy standalone build in this directory, under directory gmd-node. Standalone build can be created by compiling https://github.com/CoopNetwork/GMD-blockchain or by downloading it directly from https://node10.thecoopnetwork.io/gmd-node-standalone.zip. Files and directories should be directly in "gmd-node" dir (CoopNetwork.jar, start.bat, start.sh, conf, html, lib)
2. Crete custom JRE and copy it to gmd-node, under directory jre-for-gmd (create it).
``` jdeps -cp lib\*;conf;CoopNetwork.jar --multi-release 9 --ignore-missing-deps --list-deps CoopNetwork.jar
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

jre-for-gmd\bin\javaw.exe -cp lib\*;conf;CoopNetwork.jar -Dnxt.runtime.dirProvider=nxt.env.DefaultDirProvider nxt.Nxt 
```
3. npm install
4. [Optional] To run in dev environment use `npm start`.
5. To create self extracting installer run `npm run make`. Installer will be created in out/make/...
