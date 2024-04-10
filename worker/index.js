const keys = require('./keys');
const redis = require('redis');

function fib(n) {
  if (n < 2) {
    return n;
  }
  else {
    return fib(n - 1) + fib(n - 2);
  }
}

console.log('starting worker');
const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort
  }
});

const subscriber = redisClient.duplicate();

subscriber.connect();
redisClient.connect();

subscriber.subscribe('insert',  async (message) => {
  console.log(`processing... ${message} result is ${fib(parseInt(message))}`)
  await redisClient.hSet('values', message, fib(parseInt(message)));
});


