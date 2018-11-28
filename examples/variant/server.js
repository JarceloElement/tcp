const net = require('net')
const { StreamTcp, GdBufferTcp } = require('../../src')

let server = net.createServer((socket) => {
  const tcpSplit = new StreamTcp()
  socket.pipe(tcpSplit).on('data', async (data) => {
    const packet = new GdBufferTcp(data)

    const decoded = await packet.getVar()
    console.log('receive :', decoded)

    const packetToSend = new GdBufferTcp()
    await packetToSend.putVar(Math.random())

    console.log('send :', packetToSend.getBuffer())
    socket.write(packetToSend.getBuffer())
  })

  socket.on('error', () => console.log('Bye :('))
})

server.on('error', (err) => {
  throw err
})

server.listen(9090, '127.0.0.1', () => {
  console.log(`Server launched TCP 127.0.0.1:${9090}`)
})
