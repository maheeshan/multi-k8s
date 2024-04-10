const keys = require('./keys');

//express app setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//postgres client setup
const {Pool} = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
  password: keys.pgPassword
});

pgClient.on("connect", client => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.error(err));
});

//redis client  setup
const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
      host: keys.redisHost,
      port: keys.redisPort
    }
  }
);
redisClient.connect();

const publisher = redisClient.duplicate();

publisher.connect();

//express route handlers
app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
   const val = await redisClient.hGetAll('values');
   console.log(val);
   res.send(val);
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  await redisClient.hSet('values', index, 'Nothing yet!!!');
  await publisher.publish('insert', index);

  pgClient.query('INSERT INTO values(number) VALUES ($1)', [index]);
  res.send({working: true});
});

app.listen(5000, err => {
  console.log('listening....');
});