set jdk_url=https://download.java.net/java/GA/jdk17/0d483333a00540d886896bac774ff48b/35/GPL/openjdk-17_windows-x64_bin.zip
rem macos https://download.java.net/java/GA/jdk17/0d483333a00540d886896bac774ff48b/35/GPL/openjdk-17_macos-x64_bin.tar.gz
set jdkname=openjdk-17_windows-x64_bin

mkdir openjdk
cd openjdk

wget %jdk_url%
powershell Expand-Archive %jdkname%.zip
cd %jdkname%
cd jdk-*
call bin\jlink.exe --add-modules "java.base,java.compiler,java.desktop,java.instrument,java.logging,java.management,java.naming,java.scripting,java.security.jgss,java.sql,java.transaction.xa,java.xml" --output ../../../jre-for-gmd-win
cd ../../..
copy jre-for-gmd-win\bin\javaw.exe jre-for-gmd-win\bin\gmd-jvm.exe
rmdir /S /Q openjdk
timeout /T 5




