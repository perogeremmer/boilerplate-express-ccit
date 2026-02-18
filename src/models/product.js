import { query } from '../db/connection.js';

export class Product {
  // Get all products
  static async findAll() {
    const result = await query(
      'SELECT id, name, price, stock, created_at, updated_at FROM products ORDER BY id'
    );
    return result.rows;
  }

  // Get product by ID
  static async findById(id) {
    const result = await query(
      'SELECT id, name, price, stock, created_at, updated_at FROM products WHERE id = ?',
      [id]
    );
    return result.rows[0] || null;
  }

  // Create new product - returns insertId only
  static async create({ name, price, stock }) {
    const insertResult = await query(
      `INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`,
      [name, parseInt(price), parseInt(stock)]
    );
    
    return insertResult.rows.insertId;
  }

  // Update product - updates all provided fields
  static async update(id, { name, price, stock }) {
    await query(
      `UPDATE products 
       SET name = ?, price = ?, stock = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, parseInt(price), parseInt(stock), id]
    );
    
    // Return updated product
    return await this.findById(id);
  }

  // Delete product by ID - just execute delete
  static async delete(id) {
    await query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
  }

  // Count products
  static async count() {
    const result = await query('SELECT COUNT(*) as count FROM products');
    return result.rows[0].count;
  }
}

export default Product;
