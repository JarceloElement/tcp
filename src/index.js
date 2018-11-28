const Transform = require('stream').Transform
const { GdBuffer, putVar, getVar } = require('@gd-com/utils')

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

class GdBufferTcp extends GdBuffer {
  // need to override putVar to add length on top of it
  async putVar (value) {
    const data = await putVar(value)
    let buf = Buffer.alloc(data.length + 4)
    buf.writeUInt32LE(data.length, 0)
    data.copy(buf, 4)
    const newBuff = Buffer.alloc(this.buffer.length + buf.length)
    this.buffer.copy(newBuff, 0)
    buf.copy(newBuff, this.buffer.length)
    this.buffer = newBuff
    return newBuff
  }

  // need to override getVar to remove length on top of it
  async getVar () {
    let result = await getVar(this.buffer.slice(this.cursor + 4))
    this.cursor += result.length + 4
    await super._internalResetBuffer()
    return result.value
  }

  getBuffer () {
    let buf = Buffer.alloc(this.buffer.length + 4)
    buf.writeUInt32LE(this.buffer.length, 0)
    this.buffer.copy(buf, 4)
    return buf
  }
}

module.exports = {
  StreamTcp,
  GdBufferTcp
}
