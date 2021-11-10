

const net = require('net');
const server = net.createServer();

function nextPort(minPort, attemptCount = 10, delay = 50) {
  let port = parseInt(minPort, 10);
  let maxPort = port + attemptCount;
  let gotResult = false;
  let validPort = 0;

  server.once('error', function(err) {
    if (err.code === 'EADDRINUSE') {
      gotResult = true;
      validPort = 0;
    }
  });
  
  server.once('listening', function() {
    server.close();
    gotResult = true;
    validPort = port;
  });
  
  while (gotResult === false) {
    server.listen(port);
    if (!gotResult) {
      require('deasync').sleep(delay);
    }
    if (validPort) {
      return validPort;
    }
    if (port >= maxPort) {
      return 0;
    }
    port++;
    gotResult = false;
    validPort = 0;
  }

}

module.exports = nextPort;
