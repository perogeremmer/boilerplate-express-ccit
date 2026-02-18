import request from 'supertest';
import app from '../src/index.js';
import { query } from '../src/db/connection.js';

// Helper to create test product
const createTestProduct = async (productData) => {
  const response = await request(app)
    .post('/products')
    .send(productData)
    .set('Content-Type', 'application/json');
  return response.body.data;
};

// Helper to clear all products
const clearProducts = async () => {
  await query('TRUNCATE TABLE products');
};

describe('Products API Tests', () => {
  // Clear data before each test to ensure isolation
  beforeEach(async () => {
    await clearProducts();
  });

  describe('GET /products', () => {
    it('should return empty array when no products', async () => {
      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should return all products', async () => {
      // Create test products
      await createTestProduct({ name: 'Laptop', price: 10000000, stock: 10 });
      await createTestProduct({ name: 'Mouse', price: 150000, stock: 50 });

      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should return products with correct structure', async () => {
      await createTestProduct({ name: 'Keyboard', price: 300000, stock: 30 });

      const response = await request(app).get('/products');

      const product = response.body.data[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('stock');
    });
  });

  describe('GET /products/:id', () => {
    it('should return a single product by ID', async () => {
      const created = await createTestProduct({ name: 'Test Laptop', price: 10000000, stock: 10 });

      const response = await request(app).get(`/products/${created.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', created.id);
      expect(response.body.data).toHaveProperty('name', 'Test Laptop');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/products/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product not found');
      expect(response.body).toHaveProperty('data', {});
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Test Monitor',
        price: 2500000,
        stock: 15
      };

      const response = await request(app)
        .post('/products')
        .send(newProduct)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Product created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', newProduct.name);
      expect(response.body.data).toHaveProperty('price', newProduct.price);
      expect(response.body.data).toHaveProperty('stock', newProduct.stock);
    });

    it('should return 400 when name is missing', async () => {
      const invalidProduct = {
        price: 2500000,
        stock: 15
      };

      const response = await request(app)
        .post('/products')
        .send(invalidProduct)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Please provide name, price, and stock');
      expect(response.body).toHaveProperty('data', null);
    });

    it('should return 400 when price is missing', async () => {
      const invalidProduct = {
        name: 'Test Product',
        stock: 15
      };

      const response = await request(app)
        .post('/products')
        .send(invalidProduct)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Please provide name, price, and stock');
      expect(response.body).toHaveProperty('data', null);
    });

    it('should return 400 when stock is missing', async () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 2500000
      };

      const response = await request(app)
        .post('/products')
        .send(invalidProduct)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Please provide name, price, and stock');
      expect(response.body).toHaveProperty('data', null);
    });
  });

  describe('PUT /products/:id', () => {
    it('should update an existing product', async () => {
      const created = await createTestProduct({ name: 'Laptop', price: 10000000, stock: 10 });

      const updateData = {
        price: 15000000,
        stock: 8
      };

      const response = await request(app)
        .put(`/products/${created.id}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Product updated successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('price', updateData.price);
      expect(response.body.data).toHaveProperty('stock', updateData.stock);
    });

    it('should update only provided fields', async () => {
      const created = await createTestProduct({ name: 'Laptop', price: 10000000, stock: 10 });

      const updateData = {
        name: 'Updated Laptop Name'
      };

      const response = await request(app)
        .put(`/products/${created.id}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Product updated successfully');
      expect(response.body.data).toHaveProperty('name', updateData.name);
      expect(response.body.data).toHaveProperty('price', 10000000); // unchanged
      expect(response.body.data).toHaveProperty('stock', 10); // unchanged
    });

    it('should return 404 for non-existent product', async () => {
      const updateData = {
        price: 1000000
      };

      const response = await request(app)
        .put('/products/999')
        .send(updateData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product not found');
      expect(response.body).toHaveProperty('data', {});
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete an existing product', async () => {
      const created = await createTestProduct({ name: 'To Delete', price: 100000, stock: 5 });

      const deleteResponse = await request(app).delete(`/products/${created.id}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message', 'Product deleted successfully');
      expect(deleteResponse.body).toHaveProperty('data');
      expect(deleteResponse.body.data).toHaveProperty('id', created.id);

      // Verify it's actually deleted
      const getResponse = await request(app).get(`/products/${created.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).delete('/products/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product not found');
      expect(response.body).toHaveProperty('data', {});
    });
  });
});
