# Express.js Boilerplate

A minimal and well-structured Express.js boilerplate to jumpstart your API development.

## Features

- Express.js 5.x with ES modules support
- Environment variable configuration with dotenv
- Basic route structure with controllers
- Error handling middleware
- Jest testing setup with supertest
- Development watch mode

## Requirements

- Node.js 18.x or higher (with ES modules support)

## Installation

```bash
npm install
```

## Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3000
NODE_ENV=development
```

## Running the Application

Development mode with auto-restart on file changes:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Project Structure

```
src/
├── controllers/
│   └── main-controller.js    # Route handlers
├── routes/
│   └── index.js              # API routes
├── routes.test.js            # Route tests
└── index.js                  # Application entry point
```

## Available Routes

- `GET /` - Welcome endpoint
- `GET /health` - Health check endpoint

## Testing

Run all tests:

```bash
npm test
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `npm run dev` | Start in development mode with watch |
| `npm test` | Run tests |

## License

ISC
