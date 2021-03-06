const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require("http-proxy-middleware")

const frontendPort = process.argv[2] ? process.argv[2] : 3000;
const backendPort = process.argv[3] ? process.argv[3] : 4000;
const dev = process.argv[4] ? process.argv[4] !== 'production' : true
const app = next({ dev })
const handle = app.getRequestHandler()

//proxy to backend
const apiPaths = {
    '/api': {
        target: 'http://localhost:' + String(backendPort), 
        pathRewrite: {
            '^/api': '/api'
        },
        changeOrigin: true
    }
}

app.prepare().then(() => {
  const server = express()
 
  server.use('/api', createProxyMiddleware(apiPaths['/api']));

  server.all('*', (req, res) => {
    return handle(req, res);
  })

  server.listen(frontendPort, (err) => {
    console.log(`> Ready on http://localhost:${frontendPort}`)
  })
}).catch(err => {
    console.log('Error:: ', err);
    throw err;
})