var fs = require('fs');
const gmdnodedir="./../gmd-node";
const node_modules="./../node_modules";
const out_dir="./../out";

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`);
    fs.rmdirSync(path);
  }
};

console.log("Cleaning working tree...");

deleteFolderRecursive(gmdnodedir);
deleteFolderRecursive(node_modules);
deleteFolderRecursive(out_dir);

console.log("Successfully cleaned working tree!");

