'use strict'

const Fs = require('fs')
const Path = require('path')
const Axios = require('axios')

async function downloadImage () {
  const url = 'http://192.168.1.107:3135/api/cam/capture'
  const path = Path.resolve(__dirname, '', 'code.png')
  const writer = Fs.createWriteStream(path)

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

downloadImage()
