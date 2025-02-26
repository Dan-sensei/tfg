import redis from "@/app/lib/redis"
import { RedisSet } from "../types/interfaces";

interface RedisOptions {
    NX?: boolean;
    EX?: number;
}

interface ZRedisOptions {
    REV?: boolean;
}

const get = async (key: string) => {
    const result = await redis.get(key);
    return result;
};

const set = async (key: string, value: string, options?: RedisOptions) => {
    const adaptedOptions: any = {};
    if (options?.NX) adaptedOptions.NX = true;
    if (options?.EX) adaptedOptions.EX = options?.EX;

    await redis.set(key, value, adaptedOptions);
};

const del = async (key: string) => {
    await redis.del(key);
};

const exists = async (key: string) => {
    const result = await redis.exists(key);
    return result;
};

const rename = async (key: string, newKey: string) => {
    await redis.rename(key, newKey);
};

// HASH
interface test {
    name: string;
    totalElemenst: number;
}

const hGetAll = async (key: string) => {
    const result = await redis.hgetall(key);
    return result;
};

const hSet = async (key: string, value: any) => {
    await redis.hset(key, value);
};

// SET
const sIsMember = async (key: string, member: string) => {
    const result = await redis.sismember(key, member);
    return result;
};

const sAdd = async (key: string, member: string) => {
    await redis.sadd(key, member);
};

// SORTED SET
type ScoreMember = {
    score: number;
    member: string;
};

const zAdd = async (key: string, memberScores: ScoreMember[]) => {
    if (memberScores.length === 0) {
        console.error("No score-members provided to zAdd function");
        return;
    }

    const [firstScoreMember, ...restScoreMembers] = memberScores;
    if (restScoreMembers.length === 0) {
        await redis.zadd(key, firstScoreMember);
    } else {
        await redis.zadd(key, firstScoreMember, ...restScoreMembers);
    }
};

const zIncrBy = async (key: string, increment: number, member: string) => {
    await redis.zincrby(key, increment, member);
};

const zRange = async (
    key: string,
    start: number,
    stop: number,
    options?: ZRedisOptions
) => {
    const adaptedOptions: any = {};
    if (options?.REV) adaptedOptions.rev = true;
    const data = (await redis.zrange(
        key,
        start,
        stop,
        adaptedOptions
    )) as string[];
    return data;
};

const zRangeWithScores = async (
    key: string,
    start: number,
    stop: number,
    options?: ZRedisOptions
) => {
    const adaptedOptions: any = {
        withScores: true,
    };
    if (options?.REV) adaptedOptions.rev = true;
    const result = await redis.zrange(key, start, stop, adaptedOptions);
    const resultSet: RedisSet[] = [];

    for (let i = 0; i < result.length; i += 2) {
        const member = result[i] as string;
        const score = parseFloat(result[i + 1] as string);
        if (!isNaN(score)) {
            resultSet.push({ member, score });
        }
    }
    return resultSet;
};

const zCard = async (key: string) => {
    const result = await redis.zcard(key);
    return result;
};
const zRem = async(key: string, members: string[]) => {
    if (members.length === 0) return 0;
    const result = await redis.zrem(key, ...members);
    return result;
}

const iRedis = {
    get,
    set,
    del,
    exists,
    rename,
    hGetAll,
    hSet,
    sIsMember,
    sAdd,
    zAdd,
    zIncrBy,
    zRange,
    zRangeWithScores,
    zCard,
    zRem
};

export default iRedis;
