

set jdk_url=https://download.java.net/java/GA/jdk17/0d483333a00540d886896bac774ff48b/35/GPL/openjdk-17_windows-x64_bin.zip
set jdkname=openjdk-17_windows-x64_bin

mkdir openjdk
cd openjdk

wget %jdk_url%
powershell Expand-Archive %jdkname%.zip
cd %jdkname%
cd jdk-*
call bin\jlink.exe --add-modules "java.base,java.compiler,java.desktop,java.instrument,java.logging,java.management,java.naming,java.scripting,java.security.jgss,java.sql,java.transaction.xa,java.xml" --output ../../../../gmd-node/jre-for-gmd-win
cd ../../..
rmdir /S /Q openjdk
cd ../gmd-node
copy jre-for-gmd-win\bin\javaw.exe jre-for-gmd-win\bin\gmd-jvm.exe
cd ../build/





