const fs = require('fs');

const path = 'music';
console.log(path);

const defaults = {
  flags: 'w',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
};

console.log(JSON);

let json = [
  "test",
  "json"
];

console.log(JSON.stringify(json));

const writeStream = fs.createWriteStream('new.json',defaults);

writeStream.on('open', async (fd)=>{
  if (!fd)
    return -1;
  console.log('writeable stream');
  try {
    const files = fs.readdirSync(path);
    console.log(files, path + "/" + files[0]);
    files.forEach(file => {
      const stat = fs.statSync(path + '/' + file);
      if (stat.isDirectory())
        console.log('stat directory');
      else if (stat.isFile())
        console.log('stat file');
      else
        console.log('Not known stat');
    });

  } catch (e) {
      console.log(e);
  }
});
