import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    data: null
  });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    const mode = isDev ? 'DEVELOPMENT' : 'PRODUCTION';
    
    console.log('\n' + '='.repeat(50));
    console.log(`🚀 Server running in ${mode} mode`);
    console.log('='.repeat(50));
    console.log('🌐 Open your browser and visit:');
    console.log(`   👉 http://localhost:${PORT}`);
    console.log('='.repeat(50));
    
    if (isDev) {
      console.log('💡 Try these endpoints:');
      console.log(`   • http://localhost:${PORT}/health     (Check server status)`);
      console.log(`   • http://localhost:${PORT}/products   (List all products)`);
      console.log(`   • http://localhost:${PORT}/about      (API info)`);
      console.log('='.repeat(50) + '\n');
    }
  });
}

export default app;
