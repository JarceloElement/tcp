const net = require('net')
const { getVar, putVar } = require('@gd-com/utils')
const { StreamTcp, put } = require('../src')

const tcpSplit = new StreamTcp()

let server = net.createServer((socket) => {
  socket.pipe(tcpSplit).on('data', (packet) => {
    getVar(packet).then(decoded => {
      console.log('receive :', decoded)

      put(putVar, decoded).then(buffer => {
        socket.write(buffer)
      })
    })
  })

  socket.on('error', () => console.log('Bye :('))
})

server.on('error', (err) => {
  throw err
})

server.listen(9090, '127.0.0.1', () => {
  console.log(`Server launched TCP 127.0.0.1:${9090}`)
})
