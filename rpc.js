const { createServer } = require('http');

module.exports = (serviceRegistry, portNum) =>
  createServer((req, res) => {
    const [, serviceName, methodName] = req.url.split('/');
    const payload = [];
    req.on('data', (chunk) => payload.push(chunk));
    req.on('end', () => {
      try {
        const args = JSON.parse(payload.length === 1 ? payload[0] : Buffer.concat(payload));
        const service = serviceRegistry[serviceName];
        if (!service) {
          throw new Error('unknownService');
        }
        if (!service[methodName]) {
          throw new Error('unknownMethod');
        }
        const result = service[methodName](...args);
        res.end(JSON.stringify({ result }));
      } catch ({ message: error }) {
        res.end(JSON.stringify({ error }));
      }
    });
  }).listen(portNum);
