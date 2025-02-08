const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const winston = require("winston");

// Load Config
const config = require("../config/config.json");

// Logger Setup
const logFile = path.join(__dirname, "../logs/migration.log");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFile }),
  ],
});

// Migration State Storage (Separate Files)
const stateFolder = path.join(__dirname, "../logs/state/");
fs.ensureDirSync(stateFolder); // Ensure folder exists

const getStateFilePath = (entity) => path.join(stateFolder, `${entity}-state.json`);

const getMigrationState = (entity) => {
  const stateFile = getStateFilePath(entity);
  if (!fs.existsSync(stateFile)) return { lastProcessedId: 0 };
  return fs.readJsonSync(stateFile);
};

const updateMigrationState = (entity, data) => {
  const stateFile = getStateFilePath(entity);
  fs.writeJsonSync(stateFile, data);
};

// API Calls
const fetchWooData = async (endpoint) => {
  const url = `${config.woocommerce.url}/wp-json/wc/v3/${endpoint}`;
  const auth = {
    username: config.woocommerce.consumer_key,
    password: config.woocommerce.consumer_secret,
  };

  try {
    const response = await axios.get(url, { auth });
    return response.data;
  } catch (error) {
    logger.error(`WooCommerce API Error: ${error.message}`);
    return [];
  }
};

const postShopifyData = async (endpoint, data) => {
  const url = `https://${config.shopify.store_url}/admin/api/2023-10/${endpoint}.json`;
  const auth = {
    username: config.shopify.api_key,
    password: config.shopify.api_password,
  };

  try {
    const response = await axios.post(url, data, { auth });
    return response.data;
  } catch (error) {
    logger.error(`Shopify API Error: ${error.message}`);
    return null;
  }
};

module.exports = { 
  logger, 
  fetchWooData, 
  postShopifyData, 
  getMigrationState, 
  updateMigrationState 
};
