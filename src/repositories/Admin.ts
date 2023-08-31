import AdminModel, { AdminDocument } from '../models/Admin';
import { CreateAdminDTO } from '../dtos/Admin/CreateAdmin';
import { NotFoundError } from '../errors';

class AdminRepository {
  async create(data: CreateAdminDTO): Promise<AdminDocument> {
    const instructor = new AdminModel(data);
    return await instructor.save();
  }

  async createDefaultAdmin() {
    try {
      const existingAdmin = await AdminModel.findOne({ email: 'admin@admin.com' });
  
      if (!existingAdmin) {
        const defaultAdmin = new AdminModel({
          name: 'Admin',
          email: 'admin@admin.com',
          password: 'adminPassword',
          isAdmin: true
        });
  
        await defaultAdmin.save();
        console.log('Default Admin Created With Success!');
      }
    } catch (error) {
      console.error('Erro ao criar o admin padrão:', error);
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
