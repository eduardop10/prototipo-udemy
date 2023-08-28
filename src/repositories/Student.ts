import StudentModel, { StudentDocument } from '../models/Student';
import { CreateStudentDTO } from '../dtos/Student/CreateStudent';

class StudentRepository {
  async create(data: CreateStudentDTO): Promise<StudentDocument> {
    const Student = new StudentModel(data);
    return await Student.save();
  }

  async findById(id: string): Promise<StudentDocument | null> {
    return await StudentModel.findById(id);
  }

  async findByEmail(email: string): Promise<StudentDocument | null> {
    return await StudentModel.findOne({ email });
  }

 

  async update(id: string, data: Partial<CreateStudentDTO>): Promise<StudentDocument | null> {
    return await StudentModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {

    // Check if the user exists
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await StudentModel.findByIdAndDelete(id);
  }
}

export { StudentRepository };
