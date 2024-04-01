import { kv } from "@vercel/kv";
import { RedisSet } from "../types/interfaces";

interface RedisOptions {
    NX?: boolean;
    EX?: number;
}

interface ZRedisOptions {
    REV?: boolean;
}

const get = async (key: string) => {
    const result = await kv.get(key);
    return result;
};

const set = async (key: string, value: string, options?: RedisOptions) => {
    const adaptedOptions: any = {};
    if (options?.NX) adaptedOptions.NX = true;
    if (options?.EX) adaptedOptions.EX = options?.EX;

    await kv.set(key, value, adaptedOptions);
};

const del = async (key: string) => {
    await kv.del(key);
};

const exists = async (key: string) => {
    const result = await kv.exists(key);
    return result;
};

const rename = async (key: string, newKey: string) => {
    await kv.rename(key, newKey);
};

// HASH
interface test {
    name: string;
    totalElemenst: number;
}

const hGetAll = async (key: string) => {
    const result = await kv.hgetall(key);
    return result;
};

const hSet = async (key: string, value: any) => {
    await kv.hset(key, value);
};

// SET
const sIsMember = async (key: string, member: string) => {
    const result = await kv.sismember(key, member);
    return result;
};

const sAdd = async (key: string, member: string) => {
    await kv.sadd(key, member);
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
        await kv.zadd(key, firstScoreMember);
    } else {
        await kv.zadd(key, firstScoreMember, ...restScoreMembers);
    }
};

const zIncrBy = async (key: string, increment: number, member: string) => {
    await kv.zincrby(key, increment, member);
};

const zRange = async (
    key: string,
    start: number,
    stop: number,
    options?: ZRedisOptions
) => {
    const adaptedOptions: any = {};
    if (options?.REV) adaptedOptions.rev = true;
    const data = (await kv.zrange(
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
    const result = await kv.zrange(key, start, stop, adaptedOptions);
    const resultSet: RedisSet[] = [];

    for (let i = 0; i < result.length; i += 2) {
        const member = result[i];
        const score = result[i + 1];

        if (typeof member === "string" && typeof score === "number") {
            resultSet.push({ member, score });
        }
    }
    return resultSet;
};

const zCard = async (key: string) => {
    const result = await kv.zcard(key);
    return result;
};

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
};

export default iRedis;
