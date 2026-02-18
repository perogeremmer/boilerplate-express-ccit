# Routes Documentation

This document describes all available routes/endpoints in the application.

## Base URL

```
http://localhost:3000
```

*The port can be configured via the `PORT` environment variable (default: 3000)*

---

## Response Format

All responses follow this template:

```json
{
  "message": "Description of what happened",
  "data": ...
}
```

- `message` (string) - Description of the result
- `data` (any) - Can be: `null`, `{}` (empty object), `{...}` (single object), or `[{...}]` (array)

---

## Routes Overview

### Health Check

#### GET `/health`

Check the server status and health.

**Response:**
```json
{
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2026-02-10T18:02:54.150Z"
  }
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

### Welcome Endpoint

#### GET `/`

Returns a welcome message.

**Response:**
```json
{
  "message": "Welcome to the API",
  "data": {
    "message": "Welcome to the Express API",
    "version": "1.0.0"
  }
}
```

**Status Codes:**
- `200 OK` - Request successful

---

### About Endpoint

#### GET `/about`

Returns information about the API.

**Response:**
```json
{
  "message": "API information retrieved successfully",
  "data": {
    "name": "CCIT Student API",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "A simple API for learning Express.js"
  }
}
```

**Status Codes:**
- `200 OK` - Request successful

---

### Greet Endpoint

#### GET `/greet/:name`

Greets a person by name.

**Request Parameters:**
- `name` (string, required) - The name of the person to greet

**Response:**
```json
{
  "message": "Greeting message",
  "data": {
    "message": "Hello, Budi! Welcome to CCIT API."
  }
}
```

**Status Codes:**
- `200 OK` - Request successful

---

### Products Endpoints

#### GET `/products`

Get all products.

**Response:**
```json
{
  "message": "Products retrieved successfully",
  "data": [
    { 
      "id": 1, 
      "name": "Laptop", 
      "price": 10000000, 
      "stock": 10,
      "created_at": "2026-02-19T03:00:00.000Z",
      "updated_at": "2026-02-19T03:00:00.000Z"
    },
    { 
      "id": 2, 
      "name": "Mouse", 
      "price": 150000, 
      "stock": 50,
      "created_at": "2026-02-19T03:00:00.000Z",
      "updated_at": "2026-02-19T03:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Request successful

---

#### GET `/products/:id`

Get a single product by ID.

**Request Parameters:**
- `id` (number, required) - The product ID

**Response (Success):**
```json
{
  "message": "Product retrieved successfully",
  "data": { 
    "id": 1, 
    "name": "Laptop", 
    "price": 10000000, 
    "stock": 10,
    "created_at": "2026-02-19T03:00:00.000Z",
    "updated_at": "2026-02-19T03:00:00.000Z"
  }
}
```

**Response (Not Found):**
```json
{
  "message": "Product not found",
  "data": {}
}
```

**Status Codes:**
- `200 OK` - Product found
- `404 Not Found` - Product not found

---

#### POST `/products`

Create a new product.

**Request Body:**
```json
{
  "name": "Monitor",
  "price": 2000000,
  "stock": 20
}
```

**Response (Success):**
```json
{
  "message": "Product created successfully",
  "data": { 
    "id": 4, 
    "name": "Monitor", 
    "price": 2000000, 
    "stock": 20,
    "created_at": "2026-02-19T03:00:00.000Z",
    "updated_at": "2026-02-19T03:00:00.000Z"
  }
}
```

**Response (Bad Request):**
```json
{
  "message": "Please provide name, price, and stock",
  "data": null
}
```

**Status Codes:**
- `201 Created` - Product created successfully
- `400 Bad Request` - Missing required fields

---

#### PUT `/products/:id`

Update an existing product.

**Request Parameters:**
- `id` (number, required) - The product ID

**Request Body:**
```json
{
  "price": 12000000,
  "stock": 5
}
```

**Response (Success):**
```json
{
  "message": "Product updated successfully",
  "data": { 
    "id": 1, 
    "name": "Laptop", 
    "price": 12000000, 
    "stock": 5,
    "created_at": "2026-02-19T03:00:00.000Z",
    "updated_at": "2026-02-19T03:05:00.000Z"
  }
}
```

**Response (Not Found):**
```json
{
  "message": "Product not found",
  "data": {}
}
```

**Status Codes:**
- `200 OK` - Product updated successfully
- `404 Not Found` - Product not found

---

#### DELETE `/products/:id`

Delete a product.

**Request Parameters:**
- `id` (number, required) - The product ID

**Response (Success):**
```json
{
  "message": "Product deleted successfully",
  "data": { 
    "id": 2, 
    "name": "Mouse", 
    "price": 150000, 
    "stock": 50,
    "created_at": "2026-02-19T03:00:00.000Z",
    "updated_at": "2026-02-19T03:00:00.000Z"
  }
}
```

**Response (Not Found):**
```json
{
  "message": "Product not found",
  "data": {}
}
```

**Status Codes:**
- `200 OK` - Product deleted successfully
- `404 Not Found` - Product not found

---

## Error Responses

All endpoints may return the following error responses:

### 500 Internal Server Error

```json
{
  "message": "Something went wrong!",
  "data": null
}
```

---

## Route Organization

Routes are organized as follows:

```
src/
├── routes/
│   └── index.js          # Main router definition
├── controllers/
│   └── main-controller.js # Route handlers/logic
└── index.js              # App entry point
```

---

## Testing Routes

You can test routes using:

- **cURL:**
  ```bash
  curl http://localhost:3000/health
  curl http://localhost:3000/about
  curl http://localhost:3000/greet/Budi
  curl http://localhost:3000/products
  curl http://localhost:3000/products/1
  curl -X POST http://localhost:3000/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Monitor","price":2000000,"stock":20}'
  curl -X PUT http://localhost:3000/products/1 \
    -H "Content-Type: application/json" \
    -d '{"price":12000000,"stock":5}'
  curl -X DELETE http://localhost:3000/products/2
  ```

- **Postman** or **Insomnia**

- **Jest** (see `routes.test.js`)
