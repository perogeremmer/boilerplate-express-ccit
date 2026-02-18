'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = [
      // Original 3 products
      { name: 'Laptop', price: 10000000, stock: 10 },
      { name: 'Mouse', price: 150000, stock: 50 },
      { name: 'Keyboard', price: 300000, stock: 30 },
      
      // Monitors & Displays (4-8)
      { name: 'Monitor 24 inch', price: 2500000, stock: 25 },
      { name: 'Monitor 27 inch', price: 3500000, stock: 20 },
      { name: 'Monitor 32 inch', price: 5000000, stock: 15 },
      { name: 'Gaming Monitor 144Hz', price: 4500000, stock: 18 },
      { name: 'Curved Monitor 34 inch', price: 7500000, stock: 12 },
      
      // Storage Devices (9-15)
      { name: 'SSD 256GB', price: 600000, stock: 40 },
      { name: 'SSD 512GB', price: 1000000, stock: 35 },
      { name: 'SSD 1TB', price: 1800000, stock: 30 },
      { name: 'HDD 1TB', price: 700000, stock: 45 },
      { name: 'HDD 2TB', price: 1100000, stock: 38 },
      { name: 'External HDD 1TB', price: 900000, stock: 28 },
      { name: 'Flash Drive 128GB', price: 200000, stock: 60 },
      
      // Audio Devices (16-22)
      { name: 'Headphones', price: 500000, stock: 35 },
      { name: 'Gaming Headset', price: 800000, stock: 25 },
      { name: 'Wireless Earbuds', price: 1200000, stock: 40 },
      { name: 'Bluetooth Speaker', price: 600000, stock: 30 },
      { name: 'Soundbar', price: 1500000, stock: 20 },
      { name: 'Microphone', price: 750000, stock: 22 },
      { name: 'Webcam 1080p', price: 650000, stock: 28 },
      
      // Networking (23-27)
      { name: 'WiFi Router', price: 450000, stock: 25 },
      { name: 'WiFi 6 Router', price: 1200000, stock: 18 },
      { name: 'Network Switch 8-port', price: 350000, stock: 20 },
      { name: 'Ethernet Cable 10m', price: 100000, stock: 50 },
      { name: 'USB WiFi Adapter', price: 180000, stock: 40 },
      
      // Computer Components (28-35)
      { name: 'RAM 8GB DDR4', price: 600000, stock: 35 },
      { name: 'RAM 16GB DDR4', price: 1100000, stock: 30 },
      { name: 'RAM 32GB DDR4', price: 2200000, stock: 20 },
      { name: 'Graphics Card GTX 1650', price: 2500000, stock: 15 },
      { name: 'Graphics Card RTX 3060', price: 5500000, stock: 10 },
      { name: 'Power Supply 500W', price: 800000, stock: 25 },
      { name: 'Power Supply 650W', price: 1100000, stock: 20 },
      { name: 'CPU Cooler', price: 450000, stock: 22 },
      
      // Peripherals & Accessories (36-42)
      { name: 'Mousepad Large', price: 150000, stock: 45 },
      { name: 'Gaming Mousepad RGB', price: 350000, stock: 30 },
      { name: 'USB Hub 4-port', price: 200000, stock: 40 },
      { name: 'USB Hub 7-port', price: 350000, stock: 25 },
      { name: 'HDMI Cable 2m', price: 80000, stock: 55 },
      { name: 'DisplayPort Cable', price: 120000, stock: 40 },
      { name: 'Laptop Stand', price: 250000, stock: 35 },
      
      // Cables & Adapters (43-47)
      { name: 'USB-C to HDMI Adapter', price: 250000, stock: 30 },
      { name: 'USB-C Hub', price: 450000, stock: 25 },
      { name: 'Charger Laptop 65W', price: 400000, stock: 28 },
      { name: 'Power Bank 20000mAh', price: 550000, stock: 32 },
      { name: 'Wireless Charger', price: 280000, stock: 38 },
      
      // Other Accessories (48-50)
      { name: 'Webcam 4K', price: 1200000, stock: 15 },
      { name: 'Drawing Tablet', price: 1800000, stock: 12 },
      { name: 'Desk Lamp LED', price: 350000, stock: 28 },
    ];

    // Add timestamps to all products
    const productsWithTimestamps = products.map(product => ({
      ...product,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('products', productsWithTimestamps, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
