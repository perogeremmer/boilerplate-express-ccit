import request from 'supertest';
import app from '../src/index.js';

describe('Products API Tests', () => {
  describe('GET /products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return products with correct structure', async () => {
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
      const response = await request(app).get('/products/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('name');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/products/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Product with id 999 not found');
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
      expect(response.body).toHaveProperty('success', true);
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
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Please provide name, price, and stock');
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
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Please provide name, price, and stock');
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
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Please provide name, price, and stock');
    });
  });

  describe('PUT /products/:id', () => {
    it('should update an existing product', async () => {
      const updateData = {
        price: 15000000,
        stock: 8
      };

      const response = await request(app)
        .put('/products/1')
        .send(updateData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Product updated successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('price', updateData.price);
      expect(response.body.data).toHaveProperty('stock', updateData.stock);
    });

    it('should update only provided fields', async () => {
      const updateData = {
        name: 'Updated Laptop Name'
      };

      const response = await request(app)
        .put('/products/1')
        .send(updateData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', updateData.name);
      // Other fields should still exist
      expect(response.body.data).toHaveProperty('price');
      expect(response.body.data).toHaveProperty('stock');
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
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Product with id 999 not found');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete an existing product', async () => {
      // First, get the current products count
      const getResponse = await request(app).get('/products');
      const initialCount = getResponse.body.count;

      // Create a product to delete
      const newProduct = await request(app)
        .post('/products')
        .send({ name: 'To Delete', price: 100000, stock: 5 })
        .set('Content-Type', 'application/json');
      
      const productIdToDelete = newProduct.body.data.id;

      // Delete the product
      const deleteResponse = await request(app).delete(`/products/${productIdToDelete}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('success', true);
      expect(deleteResponse.body).toHaveProperty('message', 'Product deleted successfully');
      expect(deleteResponse.body).toHaveProperty('data');
      expect(deleteResponse.body.data).toHaveProperty('id', productIdToDelete);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).delete('/products/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Product with id 999 not found');
    });
  });
});
