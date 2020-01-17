const server = require('./app');

server.listen(3000, '0.0.0.0', () => {
    console.log('listening on 3000')
})
