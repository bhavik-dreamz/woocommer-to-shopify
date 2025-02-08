const { program } = require("commander");
const migrateProducts = require("./src/migrateProducts");
const migrateOrders = require("./src/migrateOrders");

program
  .command("migrate-products")
  .description("Migrate products from WooCommerce to Shopify")
  .action(migrateProducts);

program
  .command("migrate-orders")
  .description("Migrate orders from WooCommerce to Shopify")
  .action(migrateOrders);

program.parse(process.argv);
