import app from './app'
import http from 'http'

const server = http.createServer(app)

// 서버 연결

server.listen(3001, function() {
  console.log('server is connected on port 3001!!!')
})