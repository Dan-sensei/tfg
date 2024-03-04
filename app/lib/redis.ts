import { createClient } from "redis";

const createRedisClientSingleton = () => {
    const redisClient = createClient({
        password: process.env.REDIS_PW,
        socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        },
    });

    redisClient.on("error", (err) => console.log("Redis Client Error", err));

    if (!redisClient.isOpen) {
        redisClient.connect();
    }

    return redisClient;
};

declare global {
    var redis: ReturnType<typeof createRedisClientSingleton> | undefined;
}

const redis = globalThis.redis ?? createRedisClientSingleton();

export default redis;

if (process.env.NODE_ENV !== "production") {
    globalThis.redis = redis;
}

