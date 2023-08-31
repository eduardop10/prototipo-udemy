import { AdminRepository } from '../../repositories/Admin'; // Importe o repositório correto para administradores
import { CreateAdminDTO } from '../../dtos/Admin/CreateAdmin';
import { AdminDocument } from '../../models/Admin';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../../errors';

class CreateAdminUseCase {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(data: CreateAdminDTO): Promise<AdminDocument> {
    // Aqui, você pode adicionar validações extras se necessário, como verificar se já existe um admin
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    return await this.adminRepository.create(data);
  }
}

class LoginAdminUseCase {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(email: string): Promise<AdminDocument | null> {
    return await this.adminRepository.findByEmail(email);
  }
}

class UpdateAdminUseCase {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(adminId: string, data: Partial<CreateAdminDTO>, requesterId: string): Promise<AdminDocument | null> {
    if (adminId !== requesterId) {
      throw new UnauthorizedError('Unauthorized');
    }

    // Aqui, você pode adicionar validações extras ou lógica de atualização se necessário

    return await this.adminRepository.update(adminId, data);
  }
}

/* class AdminUseCase {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  async getDefaultAdmin(): Promise<AdminDocument | null> {
    return await this.adminRepository.findDefaultAdmin();
  }
} */

export { CreateAdminUseCase, LoginAdminUseCase, UpdateAdminUseCase,/*  AdminUseCase */ };
