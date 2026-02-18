import { Product } from '../models/product.js';
import { listResponse, itemResponse, basicResponse, errorResponse } from '../utils/response.js';

// ====== Simple Routes Controllers (Step 4) ======

export const about = (req, res) => {
  res.json(basicResponse('API information retrieved successfully', {
    name: 'CCIT Student API',
    version: '1.0.0',
    author: 'Your Name',
    description: 'A simple API for learning Express.js'
  }));
};

export const greet = (req, res) => {
  const name = req.params.name;
  res.json(basicResponse('Greeting message', {
    message: `Hello, ${name}! Welcome to CCIT API.`
  }));
};

// ====== Products CRUD Controllers (Step 5) ======

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(listResponse('Products retrieved successfully', products));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch products', null));
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json(itemResponse('Product not found', {}));
    }
    
    res.json(itemResponse('Product retrieved successfully', product));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch product', null));
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    
    // Validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json(basicResponse('Please provide name, price, and stock', null));
    }
    
    // Create product - returns insertId only
    const newId = await Product.create({ name, price, stock });
    
    // Fetch the created product data
    const newProduct = await Product.findById(newId);
    
    res.status(201).json(itemResponse('Product created successfully', newProduct));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create product', null));
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, stock } = req.body;
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json(itemResponse('Product not found', {}));
    }
    
    // Prepare update data - use existing value if field not provided in request
    const updateData = {
      name: name !== undefined ? name : existingProduct.name,
      price: price !== undefined ? price : existingProduct.price,
      stock: stock !== undefined ? stock : existingProduct.stock
    };
    
    // Update product with all fields
    const updatedProduct = await Product.update(id, updateData);
    
    res.json(itemResponse('Product updated successfully', updatedProduct));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update product', null));
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Controller fetches product first (controller's job)
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json(itemResponse('Product not found', {}));
    }
    
    // Model just executes delete (model's job)
    await Product.delete(id);
    
    res.json(itemResponse('Product deleted successfully', product));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete product', null));
  }
};

// ====== Existing Controllers ======

export class MainController {
  static getStatus(req, res) {
    res.json(basicResponse('Server is healthy', {
      status: 'ok',
      timestamp: new Date().toISOString()
    }));
  }
}

class HomeController {
  static getWelcome(req, res) {
    res.json(basicResponse('Welcome to the API', {
      message: 'Welcome to the Express API',
      version: '1.0.0'
    }));
  }
}

export { HomeController };
