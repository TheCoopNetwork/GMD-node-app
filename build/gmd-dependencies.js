const gmdnodedir="../gmd-node";
const fs = require('fs');
fs.mkdir(gmdnodedir, (err)=> {
  if(err){
    console.log("Cannot create folder "+ gmdnodedir);
  }
})

let copypackagejson = (src, dst) => {
  fs.copyFile(src, dst, (err) => {
    if (err) console.log("Copy package.json for macos failed: "+err);
  console.log('copy from ' + src + ' to ' +dst);
});
}

var child_process = require('child_process');
let os = require('os');
if(os.platform() == 'win32'){
  copypackagejson('../package.win.json','../package.json');
  child_process.execSync('windows-build-custom-jre.bat', function(error, stdout, stderr) {
    console.log("stdout "+stdout);
  });
  child_process.execSync('windows-download-compiled-node.bat', function(error, stdout, stderr) {
    console.log("stdout "+stdout);
  });
} else if (os.platform() == 'darwin'){
  copypackagejson('../package.mac.json','../package.json');
  child_process.execSync('sh macos-build-custom-jre.sh', function(error, stdout, stderr) {
    console.log("stdout "+stdout);
  });
  child_process.execSync('sh macos-download-compiled-node.sh', function(error, stdout, stderr) {                    
    console.log("stdout "+stdout);
  });
} else if (os.platform == 'linux') {
	//TODO
} else {
	console.log("unrecognized platform "+ os.platform());
}

