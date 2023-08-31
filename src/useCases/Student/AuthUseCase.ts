import { StudentRepository } from '../../repositories/Student';
import { CreateStudentDTO } from '../../dtos/Student/CreateStudent';
import { UpdateStudentDTO } from '../../dtos/Student/UpdateStudent';
import { StudentDocument } from '../../models/Student';
import { UnauthorizedError } from '../../errors';

class RegisterUseCase {
  private studentRepository: StudentRepository;

  constructor(studentRepository: StudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(data: CreateStudentDTO): Promise<StudentDocument> {
    return await this.studentRepository.create(data);
  }
}

class LoginUseCase {
  private studentRepository: StudentRepository;

  constructor(studentRepository: StudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(email: string): Promise<StudentDocument | null> {
    return await this.studentRepository.findByEmail(email);
  }
}

class AboutUseCase {
  private studentRepository: StudentRepository;

  constructor(studentRepository: StudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(id: string): Promise<StudentDocument | null> {
    return await this.studentRepository.findById(id);
  }
}

class UpdateUseCase {
  private userRepository: StudentRepository;

  constructor(userRepository: StudentRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string, data: UpdateStudentDTO, requesterId: string): Promise<StudentDocument | null> {
    if (userId !== requesterId) {
      throw new UnauthorizedError('Unauthorized');
    }

    return await this.userRepository.update(userId, data);
  }
}

class DeleteUseCase {
  private studentRepository: StudentRepository;

  constructor(studentRepository: StudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(userId: string, requesterId: string): Promise<StudentDocument | null | void> {

    // Check if the user requesting the deletion is the same as the user being deleted
    if (userId !== requesterId) {
      throw new Error('Unauthorized'); // You can create a custom error class for better organization
    }

    return await this.studentRepository.delete(userId);
  }
}



export { RegisterUseCase, LoginUseCase, AboutUseCase, UpdateUseCase, DeleteUseCase };
