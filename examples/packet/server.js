const net = require('net')
const { StreamTcp, GdBufferTcp } = require('../../src')

let server = net.createServer((socket) => {
  const tcpSplit = new StreamTcp()
  socket.pipe(tcpSplit).on('data', async (data) => {
    let packet = new GdBufferTcp(data)
    const customPacketType = await packet.getU16()
    switch (customPacketType) {
      case 5:
        const username = await packet.getVar()
        const password = await packet.getVar()
        console.log('LOGIN PACKET with data username : "' + username + '" and password : "' + password + '"')

        let sendPacket = new GdBufferTcp()
        await sendPacket.putU16(6)

        console.log('send this :', sendPacket.getBuffer())
        socket.write(sendPacket.getBuffer())

        break
      case 65535:
        console.log('WTF PACKET')
        break
      default:
        console.log('UNKNOWN PACKET')
        break
    }
  })

  socket.on('end', () => {
    console.log('Bye :(')
  })
  socket.on('error', () => {
    console.log('Bye :(')
  })
})

server.on('error', (err) => {
  throw err
})

server.listen(9090, '127.0.0.1', () => {
  console.log(`Server launched TCP 127.0.0.1:${9090}`)
})
