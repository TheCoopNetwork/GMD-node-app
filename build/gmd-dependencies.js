
var child_process = require('child_process');
let os = require('os');
if(os.platform() == 'win32'){
  child_process.execSync('windows-build-custom-jre.bat', function(error, stdout, stderr) {
    console.log("stdout "+stdout);
  });
  child_process.execSync('windows-download-compiled-node.bat', function(error, stdout, stderr) {
    console.log("stdout "+stdout);
  });
} else if (os.platform() == 'darwin'){

} else if (os.platform == 'linux') {
	//TODO
} else {
	console.log("unrecognized platform "+ os.platform());

}