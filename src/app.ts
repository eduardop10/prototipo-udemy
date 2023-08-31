import { app } from './server';
import MongoDBService from './services/MongoDBService';
import { AdminRepository } from './repositories/Admin';
const mongoDBService = new MongoDBService("mongodb+srv://ms159236:similar-udemy@similar-udemy.bckomqv.mongodb.net/?retryWrites=true&w=majority");

(async () => {
  try {
    await mongoDBService.connect();
    console.log('Connected to MongoDB 🍃');
    const adminRepository = new AdminRepository();
    adminRepository.createDefaultAdmin() 
    app.listen(3000, () => console.log(`Server is running in port 3000 🚀`));
  } catch (error) {
    console.error('Error starting server:', error);
  }
})();
