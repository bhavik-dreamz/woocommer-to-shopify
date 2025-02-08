const readline = require("readline");
const { logger, fetchWooData, postShopifyData, getMigrationState, updateMigrationState } = require("./utils");

const BATCH_SIZE = 5; // Number of products to process at a time

// Function to prompt user for input
const askUser = (question) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase());
    });
  });
};

// Check API connection
const checkAPIConnections = async () => {
  try {
    const wcTest = await fetchWooData("products?per_page=1&page=1");
    if (!wcTest || wcTest.length === 0) {
      logger.error("❌ WooCommerce API connection failed!");
      process.exit(1);
    }

    const shopifyTest = await postShopifyData("products", { product: { title: "Test Product" } });
    if (!shopifyTest) {
      logger.error("❌ Shopify API connection failed!");
      process.exit(1);
    }

    logger.info("✅ API connections verified!");
  } catch (error) {
    logger.error(`⚠ API Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Migrate products in batches
const migrateProducts = async () => {
  logger.info("🔄 Starting product migration...");

  // Check API connections before proceeding
  await checkAPIConnections();

  let state = getMigrationState();
  let lastProcessedProduct = state.lastProcessedProduct || 0;

  // Ask the user whether to resume or start over
  if (lastProcessedProduct > 0) {
    const userChoice = await askUser(
      `⚠️ Detected previous migration at product ID ${lastProcessedProduct}. Do you want to resume? (yes/no): `
    );

    if (userChoice === "no") {
      lastProcessedProduct = 0; // Restart from beginning
      updateMigrationState({ lastProcessedProduct: 0 });
      logger.info("🔄 Restarting migration from the beginning...");
    } else {
      logger.info(`🔄 Resuming from product ID ${lastProcessedProduct}...`);
    }
  }

  let page = 1;
  let hasMoreProducts = true;

  while (hasMoreProducts) {
    logger.info(`📦 Fetching products (Batch ${page})...`);
    
    // Fetch products in batches
    const products = await fetchWooData(`products?per_page=${BATCH_SIZE}&page=${page}`);

    if (!products.length) {
      hasMoreProducts = false;
      break;
    }

    for (const product of products) {
      if (product.id <= lastProcessedProduct) {
        logger.info(`⏩ Skipping already processed product: ${product.name}`);
        continue;
      }

      logger.info(`🚀 Migrating product: ${product.name}`);

      // Check if product exists in Shopify
      const existingProducts = await postShopifyData("products", { title: product.name });

      if (existingProducts) {
        logger.info(`⏩ Skipping existing product: ${product.name}`);
        continue;
      }

      // Create product in Shopify
      const newProduct = {
        product: {
          title: product.name,
          body_html: product.description || "",
          vendor: product.brand || "WooCommerce Import",
          variants: [
            {
              price: product.price,
              sku: product.sku,
              inventory_quantity: product.stock_quantity || 0,
            },
          ],
        },
      };

      const response = await postShopifyData("products", newProduct);

      if (response) {
        logger.info(`✅ Product migrated successfully: ${product.name}`);
        lastProcessedProduct = product.id;
        updateMigrationState({ lastProcessedProduct }); // Save state after each product
      } else {
        logger.error(`❌ Failed to migrate product: ${product.name}`);
      }
    }

    page++; // Move to next batch
  }

  logger.info("🎉 Product migration completed!");
};

module.exports = migrateProducts;
