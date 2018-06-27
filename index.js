const fs = require('fs');
const path = require('path');

const pathName = 'music/westworld';
console.log(pathName);

const defaults = {
  flags: 'w',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
};

// console.log(JSON);

//
// console.log(JSON.stringify(json));

const writeStream = fs.createWriteStream('new.json',defaults);

function Dir(pathTemp,dirName) {
  console.log('directory', pathTemp);
  let dir = {'path':pathTemp,'dirName':dirName,'dirs':[], 'track list':[]};
  try {
    const files = fs.readdirSync(pathTemp);
    files.forEach(file => {
      const stat = fs.statSync(pathTemp + '/' + file);
      if (stat.isDirectory())
      {
        let struct = Dir(pathTemp + '/' + file, file);
        console.log(struct);
        dir['dirs'].push(struct);
      }
      else if (stat.isFile())
      {
        if (path.extname(file) == '.mp3')
          dir['track list'].push(file);
      }
      else
        console.log('Not known stat');
    });
    if (dir['track list'].length)
      dir.albumName = dir.dirName;
  } catch (e) {
      console.log('Error dir ',e);
  }
  return dir;
}

writeStream.on('open', async (fd)=>{
  if (!fd)
    return -1;
  console.log('writeable stream');
  let struct = Dir(pathName, pathName);
  console.log('struct', struct);
  writeStream.write(JSON.stringify(struct));
});


let json = {
  "name": "",
  "files": ['test.mp4']
};

console.log(json);
console.log(json);
