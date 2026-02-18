# Express.js API Practice - CCIT

A REST API built with Express.js for learning purposes. This project includes basic routes, CRUD operations with MySQL database using raw SQL queries, and comprehensive testing.

## Features

- Express.js 5.x with ES modules support
- MySQL database with Docker
- Sequelize CLI for migrations and seeders
- Raw SQL queries for CRUD operations (no ORM)
- Environment variable configuration with dotenv
- Basic route structure with controllers
- Error handling middleware
- Jest testing setup with supertest
- Development watch mode

## Requirements

- Node.js 18.x or higher (with ES modules support)
- Docker & Docker Compose

## Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd boilerplate-express
npm install
```

### 2. Setup Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=express_user
DB_PASSWORD=express_password
DB_NAME=boilerplate_express
```

### 3. Start Docker Environment

Start MySQL database using Docker Compose:

```bash
# Start containers (MySQL + phpMyAdmin)
npm run db:up

# Check if containers are running
docker-compose ps

# View MySQL logs
npm run db:logs
```

**Services:**
- MySQL: `localhost:3306`
- phpMyAdmin: `http://localhost:8080`
  - Username: `root`
  - Password: `rootpassword`

### 4. Run Database Migrations

Create database tables using Sequelize CLI:

```bash
npm run migrate
```

### 5. Run Database Seeders (Optional)

Insert sample data into the database:

```bash
npm run seed
```

### 6. Start the Application

Development mode with auto-restart on file changes:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API will be available at `http://localhost:3000`

---

## Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start MySQL in Docker
npm run db:up

# 4. Run migrations
npm run migrate

# 5. Run seeders (optional)
npm run seed

# 6. Start development server
npm run dev
```

---

## Project Structure

```
├── config/
│   └── config.cjs              # Sequelize CLI configuration (CommonJS)
├── src/
│   ├── controllers/
│   │   └── main-controller.js  # Route handlers
│   ├── db/
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/            # Database seeders
│   ├── models/
│   │   └── product.js          # Product model (raw SQL)
│   ├── routes/
│   │   └── index.js            # API routes
│   ├── db/
│   │   └── connection.js       # MySQL connection pool
│   └── index.js                # Application entry point
├── tests/
│   ├── routes.test.js          # Basic route tests
│   └── products.test.js        # Products CRUD tests
├── docker-compose.yml          # Docker services configuration
└── .sequelizerc                # Sequelize CLI paths config
```

> **File Extension Guide:**
> - `.js` files = ES modules (use `import/export`) - for application code
> - `.cjs` files = CommonJS (use `require/module.exports`) - for Sequelize CLI only

---

## Available Routes

### Basic Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check with timestamp |
| GET | `/about` | API information |
| GET | `/greet/:name` | Greet user by name |

### Products CRUD Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create new product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

See [ROUTES.md](ROUTES.md) for detailed API documentation.

---

## Working with Database

### Creating New Migration (Table Schema)

> **Why `.cjs` instead of `.js`?**
> 
> This project uses **ES modules** (`"type": "module"` in `package.json`), which means:
> - All `.js` files use `import/export` syntax
> - **But** `sequelize-cli` was built for CommonJS (`require/module.exports`)
> 
> So we use **`.cjs`** extension to tell Node.js: "This file is CommonJS, not ES module"
> 
> **When to use which:**
> | Extension | Syntax | Used For |
> |-----------|--------|----------|
> | `.js` | `import/export` | Your code (controllers, models, routes) |
> | `.cjs` | `require/module.exports` | Sequelize CLI files only |

**Step 1: Generate migration file**
```bash
npx sequelize-cli migration:generate --name create-categories-table
```
This creates a new file in `src/db/migrations/` with timestamp prefix.

**Step 2: Rename to `.cjs`**

The generated file will have `.js` extension, but we need `.cjs`:

```bash
# Find the generated file and rename it
mv src/db/migrations/20250219XXXXXX-create-categories-table.js src/db/migrations/20250219XXXXXX-create-categories-table.cjs
```

> **Why can't we just use `.js` for everything?**
> 
> If we use `.js` for migration files:
> ```
> ERROR: module is not defined in ES module scope
> ```
> 
> This happens because:
> 1. `package.json` says `"type": "module"` (all `.js` = ES modules)
> 2. Sequelize CLI uses `module.exports = {...}` (CommonJS)
> 3. Node.js sees `.js` + `"type": "module"` = expects `export` not `module.exports`
> 4. Result: Error because `module` is not defined in ES modules
> 
> **Solution:** Use `.cjs` extension which forces CommonJS mode regardless of `package.json` settings.

**Step 2: Edit the migration file (`.cjs`)**

Open the `.cjs` file and define your table schema using CommonJS syntax:

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};
```

> ⚠️ **Note:** Use `module.exports` (CommonJS) not `export` (ES modules) in `.cjs` files.

**Step 3: Run the migration**
```bash
npm run migrate
```

---

### Creating New Seeder (Sample Data)

> **Remember:** Seeder files also need `.cjs` extension (same reason as migrations - Sequelize CLI uses CommonJS).

**Step 1: Generate seeder file**
```bash
npx sequelize-cli seed:generate --name demo-categories
```
This creates a new file in `src/db/seeders/`.

**Step 2: Rename to `.cjs`**
```bash
mv src/db/seeders/20250219XXXXXX-demo-categories.js src/db/seeders/20250219XXXXXX-demo-categories.cjs
```

**Step 2: Edit the seeder file (`.cjs`)**

Open the `.cjs` file and add your data using CommonJS syntax:

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Accessories',
        description: 'Computer and device accessories',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
```

**Step 3: Run the seeder**
```bash
npm run seed
```

---

### Creating New Model (Raw SQL Approach)

In this project, we use **raw SQL queries** (not Sequelize ORM models). To create a new model:

**Step 1: Create model file in `src/models/`**

```bash
# Example: create src/models/category.js
```

**Step 2: Write the model with raw SQL queries**

```javascript
import { query } from '../db/connection.js';

export class Category {
  // Get all categories
  static async findAll() {
    const result = await query(
      'SELECT id, name, description, created_at, updated_at FROM categories ORDER BY id'
    );
    return result.rows;
  }

  // Get category by ID
  static async findById(id) {
    const result = await query(
      'SELECT id, name, description, created_at, updated_at FROM categories WHERE id = ?',
      [id]
    );
    return result.rows[0] || null;
  }

  // Create new category
  static async create({ name, description }) {
    const insertResult = await query(
      `INSERT INTO categories (name, description) VALUES (?, ?)`,
      [name, description]
    );
    return insertResult.rows.insertId;
  }

  // Update category
  static async update(id, { name, description }) {
    await query(
      `UPDATE categories 
       SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, description, id]
    );
    return await this.findById(id);
  }

  // Delete category
  static async delete(id) {
    await query('DELETE FROM categories WHERE id = ?', [id]);
  }
}

export default Category;
```

**Step 3: Create controller and routes** (see existing examples in `src/controllers/` and `src/routes/`)

---

### Complete Example: Adding a New Feature

Let's say you want to add a `categories` feature:

```bash
# 1. Create migration (table structure)
npx sequelize-cli migration:generate --name create-categories-table

# 2. Edit migration file, then run it
npm run migrate

# 3. Create seeder (sample data)
npx sequelize-cli seed:generate --name demo-categories

# 4. Edit seeder file, then run it
npm run seed

# 5. Create model (raw SQL)
# Create src/models/category.js

# 6. Create controller
# Create or update src/controllers/category-controller.js

# 7. Add routes
# Update src/routes/index.js
```

---

### Database Commands Reference

#### Migrations
```bash
# Run all pending migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all

# Reset and re-run all migrations
npm run migrate:fresh
```

#### Seeders
```bash
# Run all seeders
npm run seed

# Undo all seeders
npm run seed:undo
```

---

## Docker Commands

```bash
# Start containers
npm run db:up

# Stop containers
npm run db:down

# View MySQL logs
npm run db:logs
```

---

## Testing

### Prerequisites

**IMPORTANT:** Make sure Docker is running before testing:

```bash
# Start MySQL container (if not already running)
npm run db:up

# Wait a few seconds for MySQL to be ready
```

### Running Tests

Run all tests:

```bash
npm test
```

> **Note:** Tests use `--forceExit` to ensure clean exit after database operations. This is a known Jest behavior when using `globalSetup` with child processes.

Run tests in watch mode:

```bash
npm test -- --watch
```

### How Tests Work

Every time you run `npm test`:

1. **Database is automatically created** (if not exists)
2. **Migrations run** - Tables are created via Sequelize CLI
3. **ALL existing data is cleared** - Clean slate before tests start
4. **Each test creates its own data** - Tests are self-contained
5. **Data is cleared before each test** via `beforeEach()` hook

This ensures:
- **No leftover data** from previous test runs
- **No interference** from manual testing or development data
- **Complete isolation** - each test creates exactly the data it needs

### Complete Test Workflow

```bash
# 1. Start Docker (one time per session)
npm run db:up

# 2. Run tests (tables created, but empty)
npm test

# 3. Run tests again (fresh empty database)
npm test
```

### Writing Tests

Tests follow this pattern (see `tests/products.test.js`):

```javascript
import { query } from '../src/db/connection.js';

// Helper to clear data
const clearProducts = async () => {
  await query('TRUNCATE TABLE products');
};

describe('Products API Tests', () => {
  // Clear before each test for isolation
  beforeEach(async () => {
    await clearProducts();
  });

  it('should create a product', async () => {
    // Create test data via API
    const response = await request(app)
      .post('/products')
      .send({ name: 'Test', price: 1000, stock: 10 });
    
    expect(response.status).toBe(201);
  });
});
```

**Key principles:**
- Each test creates its own data via API calls
- `beforeEach()` clears tables for isolation
- Tests don't depend on seed data

### Using Separate Test Database (Optional)

By default, tests use the same database as development. To use a separate test database:

```bash
# 1. Create test database
docker exec -it boilerplate_mysql mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS boilerplate_express_test;"
# Password: rootpassword

# 2. Update .env for testing
export DB_NAME=boilerplate_express_test

# 3. Run tests
npm test
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `npm run dev` | Start in development mode with watch |
| `npm test` | Run tests |
| `npm run migrate` | Run database migrations |
| `npm run migrate:undo` | Undo last migration |
| `npm run migrate:fresh` | Reset and re-run all migrations |
| `npm run seed` | Run database seeders |
| `npm run db:up` | Start Docker containers |
| `npm run db:down` | Stop Docker containers |
| `npm run db:logs` | View MySQL logs |

---

## Response Format

All API responses follow this template format:

### Template Structure
```json
{
  "message": "Description of what happened",
  "data": ...
}
```

### Response Types

**1. Message only (no data):**
```json
{
  "message": "Please provide name, price, and stock",
  "data": null
}
```

**2. Single item (object):**
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

**3. List of items (array):**
```json
{
  "message": "Products retrieved successfully",
  "data": [
    { "id": 1, "name": "Laptop", ... },
    { "id": 2, "name": "Mouse", ... }
  ]
}
```

**4. Empty list:**
```json
{
  "message": "Products retrieved successfully",
  "data": []
}
```

**5. Not found (empty object):**
```json
{
  "message": "Product not found",
  "data": {}
}
```

**6. Error:**
```json
{
  "message": "Failed to fetch product",
  "data": null
}
```

---

## Learning Objectives

This project is designed for students to learn:

1. **Express.js fundamentals** - Routing, middleware, controllers
2. **Database operations** - Using raw SQL queries (not ORM)
3. **Database migrations** - Using Sequelize CLI for schema management
4. **Docker basics** - Running MySQL in containers
5. **API testing** - Using Jest and Supertest
6. **Environment configuration** - Using dotenv

---

## FAQ

### Q: Why do I need to use `.cjs` for migrations/seeders but `.js` for everything else?

**A:** This is because of how Node.js handles module systems:

1. **Our project uses ES modules** (`"type": "module"` in `package.json`)
   - All `.js` files are treated as ES modules
   - Use `import` and `export` syntax

2. **Sequelize CLI was built for CommonJS** (older Node.js module system)
   - Uses `require()` and `module.exports`
   - Doesn't support ES modules natively

3. **The conflict:**
   ```
   package.json says: "type": "module"  ← All .js = ES modules
   Sequelize CLI uses: module.exports   ← CommonJS syntax
   Result: ERROR - module is not defined in ES module scope
   ```

4. **The solution:**
   - Use `.cjs` extension for files that need CommonJS
   - `.cjs` forces Node.js to treat the file as CommonJS
   - Regardless of what `package.json` says

**Summary:**
| File Type | Extension | Module System | Syntax |
|-----------|-----------|---------------|--------|
| Your code (controllers, models, routes) | `.js` | ES modules | `import/export` |
| Sequelize CLI files (migrations, seeders, config) | `.cjs` | CommonJS | `require/module.exports` |

### Q: What happens if I forget to rename to `.cjs`?

**A:** You'll get this error:
```
ERROR: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension 
and '/package.json' contains "type": "module".
```

**Fix:** Rename the file from `.js` to `.cjs`
```bash
mv my-migration.js my-migration.cjs
```

### Q: Can I just change `package.json` to use CommonJS instead?

**A:** Yes, but then you'd need to:
- Change ALL your application files to use `require()` instead of `import`
- Change all `export` to `module.exports`
- Modern Node.js projects prefer ES modules

Using `.cjs` for just a few Sequelize files is the cleaner solution.

### Q: Will this always be necessary?

**A:** Hopefully not! The Sequelize team is working on ES module support. In the future, you might be able to use `.js` with ES module syntax in migrations. But for now, `.cjs` is the reliable solution.

---

## License

ISC
