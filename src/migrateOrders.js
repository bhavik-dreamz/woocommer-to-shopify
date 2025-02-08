const { logger, fetchWooData, postShopifyData, getMigrationState, updateMigrationState } = require("./utils");

const migrateOrders = async () => {
  logger.info("Starting order migration...");

  let state = getMigrationState();
  const orders = await fetchWooData("orders");

  for (const order of orders) {
    if (order.id <= state.lastProcessedOrder) {
      logger.info(`Skipping already processed order: ${order.id}`);
      continue;
    }

    logger.info(`Migrating order: ${order.id}`);

    const shopifyOrder = {
      order: {
        email: order.billing.email,
        total_price: order.total,
        line_items: order.line_items.map(item => ({
          title: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      }
    };

    const response = await postShopifyData("orders", shopifyOrder);

    if (response) {
      logger.info(`✔ Order migrated: ${order.id}`);
      state.lastProcessedOrder = order.id;
      updateMigrationState(state);
    } else {
      logger.error(`❌ Failed to migrate order: ${order.id}`);
    }
  }

  logger.info("Order migration completed!");
};

module.exports = migrateOrders;
