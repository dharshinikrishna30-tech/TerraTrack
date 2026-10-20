import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`🌿 TerraTrack Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`=============================================`);
    });
  } catch (error) {
    console.error('Failed to start TerraTrack server:', error);
    process.exit(1);
  }
};

startServer();
