import { InstructorRepository } from '../../repositories/Instructor';
import { CreateInstructorDTO } from '../../dtos/Instructor/CreateInstructor';
import { UpdateInstructorDTO } from '../../dtos/Instructor/UpdateInstructor';
import { InstructorDocument } from '../../models/Instructor';
import { UnauthorizedError } from '../../errors';

class RegisterUseCase {
  private InstructorRepository: InstructorRepository;

  constructor(InstructorRepository: InstructorRepository) {
    this.InstructorRepository = InstructorRepository;
  }

  async execute(data: CreateInstructorDTO): Promise<InstructorDocument> {
    return await this.InstructorRepository.create(data);
  }
}

class LoginUseCase {
  private InstructorRepository: InstructorRepository;

  constructor(InstructorRepository: InstructorRepository) {
    this.InstructorRepository = InstructorRepository;
  }

  async execute(email: string): Promise<InstructorDocument | null> {
    return await this.InstructorRepository.findByEmail(email);
  }
}

class UpdateUseCase {
  private instructorRepository: InstructorRepository;

  constructor(userRepository: InstructorRepository) {
    this.instructorRepository = userRepository;
  }

  async execute(userId: string, data: UpdateInstructorDTO, requesterId: string): Promise<InstructorDocument | null> {
    if (userId !== requesterId) {
      throw new UnauthorizedError('Unauthorized');
    }

    return await this.instructorRepository.update(userId, data);
  }
} 

class DeleteUseCase {
  private instructorRepository: InstructorRepository;

  constructor(instructorRepository: InstructorRepository) {
    this.instructorRepository = instructorRepository;
  }

  async execute(userId: string, requesterId: string): Promise<InstructorDocument | null | void> {
    // Check if the user requesting the deletion is the same as the user being deleted
    if (userId !== requesterId) {
      throw new UnauthorizedError('Unauthorized'); 
    }

    return await this.instructorRepository.delete(userId);
  }
}


export { RegisterUseCase, LoginUseCase , UpdateUseCase, DeleteUseCase };
