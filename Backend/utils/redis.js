import { randomUUID } from "crypto";
import { createClient } from "redis";

import { log } from "./logger.js";
import { LOG_LEVEL, REDIS_CONNECTION_STATE } from "../constants.js";

class RedisClient {
    static redisClientInstance = null;

    constructor() {
        if (!RedisClient.redisClientInstance) {
            this.client = createClient({
                socket: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                    tls: process.env.REDIS_TLS_USE === "1",
                },
            });
            this.client.on(REDIS_CONNECTION_STATE.ERROR, (error) => {
                log(LOG_LEVEL.ERROR, error, {}, null);
            });
            this.client.on(REDIS_CONNECTION_STATE.CONNECT, () => {
                log(LOG_LEVEL.INFO, "Successfully connected to REDIS server", {}, null);
            });
            RedisClient.redisClientInstance = this;
        } else {
            return RedisClient.redisClientInstance;
        }
    }

    reconnect() {
        if (!this.client.isOpen) {
            this.client.connect();
        }
    }

    async setKey(key, value, ttl = null) {
        this.reconnect();
        if (ttl) {
            return await this.client.setEx(key, ttl, value);
        } else {
            return await this.client.set(key, value);
        }
    }

    async setHashData(key, data, ttl = null) {
        this.reconnect();
        const response = await this.client.HSET(key, data);
        if (ttl) {
            await this.client.expire(key, ttl);
        }
        return response;
    }

    async setHashAttributeData(hashKey, attributeKey, data) {
        this.reconnect();
        return await this.client.HSET(hashKey, attributeKey, data);
    }

    async getHashData(hashKey, dataKey = null) {
        this.reconnect();
        if (!dataKey) {
            return await this.client.hGetAll(hashKey);
        } else {
            return await this.client.hGet(hashKey, dataKey);
        }
    }

    async deleteKey(key) {
        try {
            this.reconnect();
            return await this.client.del(key);
        } catch (error) {
            log(
                LOG_LEVEL.ERROR,
                `Key could not be deleted due to ${error.message}`,
                { key },
                null
            );
        }
    }

    async getKeyData(key, req = null) {
        this.reconnect();
        try {
            return await this.client.get(key);
        } catch (error) {
            log(
                LOG_LEVEL.ERROR,
                "Required Key is missing in REDIS Cache",
                { key },
                req
            );
        }
    }

    async setLock(key, ttl) {
        this.reconnect();
        const lockValue = randomUUID();
        const isLockAcquired = await this.client.SET(key, lockValue, {
            EX: ttl ? ttl : 10, // TTL for lock max
            NX: true,
        });
        return [lockValue, isLockAcquired];
    }

    async releaseLock(key, value) {
        this.reconnect();
        const lockValue = await this.getKeyData(key);
        if (lockValue === value) {
            return await this.deleteKey(key);
        }
    }

    async getKeys(pattern) {
        this.reconnect();
        return await this.client.keys(pattern);
    }

    async getKeyTtl(key) {
        this.reconnect();
        return await this.client.TTL(key);
    }

    async doesKeyExist(key) {
        this.reconnect();
        return (await this.client.exists(key)) === 1;
    }

    async getKeyType(key) {
        this.reconnect();
        return await this.client.type(key);
    }

    async getListData(key, req = null) {
        this.reconnect();
        try {
            return await this.client.lRange(key, 0, -1);
        } catch (error) {
            log(
                LOG_LEVEL.ERROR,
                `Failed to fetch list data from Redis for key: ${key} due to ${error.message}`,
                { key },
                req
            );
        }
        return [];
    }
}

export default RedisClient;
