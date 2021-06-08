// Uncomment this if not using docker (for non-docker npm start)
const path = require('path')
require('dotenv-safe').config({ allowEmptyValues: true, path: path.resolve(__dirname, '../.env'), example: path.resolve(__dirname, '../.env.example') })

const devMode = process.env.DEV_MODE === '1' // Set to false only when running in remit.rocks
console.log("devMode: ", devMode)

const sysmode = devMode ? 'dev' : 'prod'
console.log('sysmode: ', sysmode)

// ROKS (origin) API CORS Settings
// Allowed DEV origin
// Add localhost here if working on local environment
// Do not include the protocol (root host only)
const allowedDevRoksOrigin = [
    "https://send.rockstable.io",
]
// Allowed PROD origin
const allowedProdRoksOrigin = [
    "https://remit.rocks",
]

// Azure (origin) API CORS Settings
// Allowed DEV origin
const allowedDevAzureOrigin = [
    "https://prod-03.westus2.logic.azure.com",
]
// Allowed PROD origin
const allowedProdAzureOrigin = [
    "https://prod-31.westus2.logic.azure.com",
]

const roks = devMode? allowedDevRoksOrigin: allowedProdRoksOrigin

// devMode = true // remove this when we have the Prime Trust key

const azure = devMode? allowedDevAzureOrigin: allowedProdAzureOrigin

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
    publicPath: '../client/build',
	port: 3003,
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
