const Transform = require('stream').Transform

class StreamTcp extends Transform {
  _transform (chunk, enc, done) {
    let buffer = chunk
    while (buffer.length > 0) {
      const length = buffer.readUInt16LE(0)

      const bufferSplitted = buffer.slice(4, length + 4) // 4 cause the length bytes is in buffer
      buffer = buffer.slice(length + 4, buffer.length) // 4 cause the length bytes is in buffer

      this.push(bufferSplitted)
    }
    done()
  }
}

const put = (method, value) => {
  return new Promise((resolve, reject) => {
    try {
      method(value).then(encoded => {
        let buf = Buffer.alloc(encoded.length + 4)
        buf.writeUInt32LE(encoded.length, 0)
        encoded.copy(buf, 4)
        resolve(buf)
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  StreamTcp,
  put
}
