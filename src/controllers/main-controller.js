// In-memory storage for products
let products = [
  { id: 1, name: 'Laptop', price: 10000000, stock: 10 },
  { id: 2, name: 'Mouse', price: 150000, stock: 50 },
  { id: 3, name: 'Keyboard', price: 300000, stock: 30 }
];

// Helper function to generate new ID
const generateId = () => {
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

// ====== Simple Routes Controllers (Step 4) ======

export const about = (req, res) => {
  res.json({
    name: 'CCIT Student API',
    version: '1.0.0',
    author: 'Your Name',
    description: 'A simple API for learning Express.js'
  });
};

export const greet = (req, res) => {
  const name = req.params.name;
  res.json({
    message: `Hello, ${name}! Welcome to CCIT API.`
  });
};

// ====== Products CRUD Controllers (Step 5) ======

export const getAllProducts = (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products
  });
};

export const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with id ${id} not found`
    });
  }
  res.json({
    success: true,
    data: product
  });
};

export const createProduct = (req, res) => {
  const { name, price, stock } = req.body;
  // Validation
  if (!name || !price || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, price, and stock'
    });
  }
  const newProduct = {
    id: generateId(),
    name: name,
    price: parseInt(price),
    stock: parseInt(stock)
  };
  products.push(newProduct);
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
};

export const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, stock } = req.body;
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with id ${id} not found`
    });
  }
  // Update only provided fields
  if (name) products[productIndex].name = name;
  if (price) products[productIndex].price = parseInt(price);
  if (stock !== undefined) products[productIndex].stock = parseInt(stock);
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex]
  });
};

export const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with id ${id} not found`
    });
  }
  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct
  });
};

// ====== Existing Controllers ======

export class MainController {
  static getStatus(req, res) {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }
}

class HomeController {
  static getWelcome(req, res) {
    res.json({
      message: 'Welcome to the Express API',
      version: '1.0.0'
    });
  }
}

export { HomeController };
