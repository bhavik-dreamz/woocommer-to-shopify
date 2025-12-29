WooCommerce to Shopify Migration Script  
========================================  

This script migrates **products, orders, customers, categories, tags, attributes, variations, payment gateways, and subscriptions** from WooCommerce to Shopify using **Node.js**.  

It includes:  
✅ Batch processing (5 items at a time) to prevent crashes  
✅ Resume functionality (if interrupted, it asks whether to continue or restart)  
✅ Separate state tracking for products, orders, and other entities  
✅ Error logging and duplicate prevention  
✅ Command-line execution with logging to a file  

---------------------------------------------------------------  

🚀 Features  
------------  
- Migrate WooCommerce to Shopify seamlessly  
- Handles large datasets by processing in batches of 5  
- Logs migration progress and skips already migrated items  
- Stores migration states separately for products, orders, etc.  
- Supports resume functionality after interruption  

---------------------------------------------------------------  

📦 Installation  
-----------------  

1️⃣ Clone the Repository  
git clone https://github.com/bhavik-dreamz/woocommer-to-shopify.git  
cd woocommerce-to-shopify-migration  

2️⃣ Install Dependencies  
npm install  

---------------------------------------------------------------  

🔧 Configuration  
-----------------  

Edit the **config file** (`config/config.json`) and add your WooCommerce and Shopify API credentials:  

{
  "woocommerce": {
    "url": "https://yourstore.com",
    "consumer_key": "your_woocommerce_consumer_key",
    "consumer_secret": "your_woocommerce_consumer_secret"
  },
  "shopify": {
    "store_url": "your-shopify-store.myshopify.com",
    "api_key": "your_shopify_api_key",
    "api_password": "your_shopify_api_password"
  }
}  

---------------------------------------------------------------  

🚀 Usage  
----------  

Run migration scripts using command-line:  

🔹 Migrate Products  
node index.js migrate-products  
✅ Fetches products in **batches of 5**  
✅ Checks if a product already exists in Shopify before adding  
✅ Saves the last migrated product ID to **resume if interrupted**  

🔹 Migrate Orders  
node index.js migrate-orders  
✅ Migrates orders **one by one**  
✅ Ensures no duplicate orders are created  
✅ Saves last migrated order ID for **resume functionality**  

🔹 Migrate Customers  
node index.js migrate-customers  
✅ Transfers WooCommerce customers to Shopify  
✅ Skips already existing customers  
✅ Stores migration state separately  

---------------------------------------------------------------  

📜 Logs & Migration State  
---------------------------  

📂 Log file: `logs/migration.log`  
📂 Migration state files:  
- `logs/state/products-state.json`  
- `logs/state/orders-state.json`  
- `logs/state/customers-state.json`  

---------------------------------------------------------------  

🛠 Troubleshooting  
---------------------  
- **Error: WooCommerce API not working?**  
  Ensure the **API keys** are correct and WooCommerce REST API is enabled.  
- **Error: Shopify API error?**  
  Check if the API credentials are correct in `config.json`.  
- **Script stopped unexpectedly?**  
  Restart the script, and it will **ask whether to resume or restart**.  

---------------------------------------------------------------  

👨‍💻 Contributing  
---------------------  
Feel free to fork this repo, create an issue, or submit a pull request! 🚀  

---------------------------------------------------------------  

📜 License  
------------  
This project is **open-source** and licensed under the **MIT License**.  

---------------------------------------------------------------  

✨ Happy Migrating! 🚀  
