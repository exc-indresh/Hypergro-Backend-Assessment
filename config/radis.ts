import { createClient } from 'redis';

const redisClient = createClient({
  password:process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-11322.c99.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 11322,
  },
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
