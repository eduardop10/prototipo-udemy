import AdminModel, { AdminDocument } from '../models/Admin';
import { CreateAdminDTO } from '../dtos/Admin/CreateAdmin';
import { NotFoundError } from '../errors';

import * as dotenv from 'dotenv';
dotenv.config();

class AdminRepository {
  async create(data: CreateAdminDTO): Promise<AdminDocument> {
    const instructor = new AdminModel(data);
    return await instructor.save();
  }

  async createDefaultAdmin() {
      const existingAdmin = await AdminModel.findOne({ email: process.env.ADMIN_EMAIL });
  
      if (!existingAdmin) {
        const defaultAdmin = new AdminModel({
          name: 'Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          isAdmin: true
        });
        
        await defaultAdmin.save();
        console.log('Default Admin Created With Success!');
      }
    
  }

  async findById(id: string): Promise<AdminDocument | null> {
    return await AdminModel.findById(id);
  }

  async findByEmail(email: string): Promise<AdminDocument | null> {
    return await AdminModel.findOne({ email });
  }

  async update(id: string, data: Partial<CreateAdminDTO>): Promise<AdminDocument | null> {
    return await AdminModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {

    // Check if the user exists
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await AdminModel.findByIdAndDelete(id);
  }
}

export { AdminRepository };
