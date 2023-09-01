import { app } from './server';
import * as dotenv from 'dotenv';
dotenv.config();

import MongoDBService from './services/MongoDBService';
import { AdminRepository } from './repositories/Admin';

const mongoURI = process.env.MONGO_URI;
const port= process.env.SERVER_PORT || 3000

if (!mongoURI) {
  throw new Error('MONGO_URI not defined in environment');
}

const mongoDBService = new MongoDBService(mongoURI);

(async () => {
  try {
    await mongoDBService.connect();
    console.log('Connected to MongoDB 🍃');
    
    //Create Admin
    const adminRepository = new AdminRepository();
    adminRepository.createDefaultAdmin() 

    app.listen(port, () => console.log(`Server is running in port ${port} 🚀`));
  } catch (error) {
    console.error('Error starting server:', error);
  }
})();
