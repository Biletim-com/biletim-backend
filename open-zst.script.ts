import 'reflect-metadata';
const fs = require('fs');
import { ZSTDDecompress } from 'simple-zstd';

// ZSTDDecompressMaybe(spawnOptions, streamOptions, zstdOptions)

fs.createReadStream('feed_en_v3.json.zst')
  .pipe(ZSTDDecompress())
  .pipe(fs.createWriteStream('hotels.json'))
  .on('error', (err) => {
    console.log({ err });
    //..
  })
  .on('finish', () => {
    console.log('Copy Complete!');
  });
