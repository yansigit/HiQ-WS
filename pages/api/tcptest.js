import net from 'net'

export default async function handler(req, res) {
    const socket = net.connect({
        port: 5000,
        host: '192.168.3.66',
    })

    socket.setEncoding('utf8')

    socket.setTimeout(1000)
    socket.on('timeout', () => {
        socket.destroy()
        socket.end()
        res.status(400).json({error: 'time out'})
    })

    socket.on('connect', () => {
        console.log('connected')
        socket.write('hi')
    })

    socket.on('data', data => {
        console.log(data)
    })

    socket.on('close', () => {
        console.log('close')
        res.status(200).json({success: true})
    })

    socket.on('error', err => {
        console.log('on error: ', err.code);
        res.status(400).json({error: err})
    });
}