#!/bin/bash

jdk_url=https://download.java.net/java/GA/jdk17/0d483333a00540d886896bac774ff48b/35/GPL/openjdk-17_macos-x64_bin.tar.gz
jdkname=openjdk-17_macos-x64_bin

mkdir -p openjdk
cd openjdk

wget $jdk_url
tar xzfv "$jdkname.tar.gz"
jlink=./jdk-17.jdk/Contents/Home/bin/jlink
#chmod +x $jlink
$jlink --add-modules "java.base,java.compiler,java.desktop,java.instrument,java.logging,java.management,java.naming,java.scripting,java.security.jgss,java.sql,java.transaction.xa,java.xml" --output ../../gmd-node/jre-for-gmd-mac

cd ..
rm -rf openjdk

cd ../gmd-node/jre-for-gmd-mac/bin
cp java gmd-jvm
