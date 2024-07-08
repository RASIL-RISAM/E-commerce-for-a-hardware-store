import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config({ path: ".env" });


const client = createClient({
    password:process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-16923.c262.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 16923
    }
});
client.on('error', err => console.log('Redis Client Error', err));

client.connect();

export default client;
