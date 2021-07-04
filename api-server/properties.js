const path = require('path')
require('dotenv').config({ allowEmptyValues: true, path: path.resolve(__dirname, '.env') })

const devMode = true // Set to false only when running in prod server
console.log("devMode: ", devMode)

const sysmode = devMode ? 'dev' : 'prod'
console.log('sysmode: ', sysmode)

// Allowed DEV origin
// Add localhost here if working on local environment
// Do not include the protocol (root host only)
const allowedDevRoksOrigin = [
]
// Allowed PROD origin
const allowedProdRoksOrigin = [
]

// Azure (origin) API CORS Settings
// Allowed DEV origin
const allowedDevAzureOrigin = [
]
// Allowed PROD origin
const allowedProdAzureOrigin = [
]

const roks = devMode ? allowedDevRoksOrigin : allowedProdRoksOrigin

// devMode = true // remove this when we have the Prime Trust key

const azure = devMode ? allowedDevAzureOrigin : allowedProdAzureOrigin

const http_options = {
    keepAlive: true,
    timeout: 20000, // milliseconds,
    withCredentials: false,
};

const ws_options = {
    timeout: 30000, // ms
    clientConfig: {
        // Useful if requests are large
        maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
        maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
        // Useful to keep a connection alive
        keepalive: true,
        keepaliveInterval: 60000 // ms
    },
    // Enable auto reconnection
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
}

const secret = process.env.SECRET

export default {
    BASE_API_URL: "/api",
    PYTH_PRODUCT_KEY: process.env.PYTH_PRODUCT_KEY,
    PYTH_SOL_PRICE_PROG_KEY: process.env.PYTH_SOL_PRICE_PROG_KEY,
    PRICE_ACCOUNT_KEY: process.env.PRICE_ACCOUNT_KEY,
    publicPath: '/api/docs',
    port: 3001,

    devMode,
    tokenSecret: "Insert Your Secret Token",
    api: "/api",
    debugOn: true,
    corsOptions: {
        roks,
        azure,
    },
    http_options,
    ws_options,
    secret
}
