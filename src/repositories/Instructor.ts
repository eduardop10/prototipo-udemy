import InstructorModel, { InstructorDocument } from '../models/Instructor';
import { CreateInstructorDTO } from '../dtos/Instructor/CreateInstructor';
import { NotFoundError } from '../errors';

class InstructorRepository {
  async create(data: CreateInstructorDTO): Promise<InstructorDocument> {
    const instructor = new InstructorModel(data);
    return await instructor.save();
  }

  async findAll(): Promise<InstructorDocument[]> {
    return await InstructorModel.find();
  }

  async findById(id: string): Promise<InstructorDocument | null> {
    return await InstructorModel.findById(id);
  }

  async findByEmail(email: string): Promise<InstructorDocument | null> {
    return await InstructorModel.findOne({ email });
  }

  async update(id: string, data: Partial<CreateInstructorDTO>): Promise<InstructorDocument | null> {
    return await InstructorModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {

    // Check if the user exists
    const user = await this.findById(id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await InstructorModel.findByIdAndDelete(id);
  }
}

export { InstructorRepository };
