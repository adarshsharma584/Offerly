require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config/env');

const PORT = config.port;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Offerly Backend Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
