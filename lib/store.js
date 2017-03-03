const redis = require("redis");
const Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({return_buffers: true});

client.on("error", function(err) {
    console.log("Error " + err);
});

module.exports = client;
