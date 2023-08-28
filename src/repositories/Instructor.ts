import InstructorModel, { InstructorDocument } from '../models/Instructor';
import { CreateInstructorDTO } from '../dtos/Instructor/CreateInstructor';

class InstructorRepository {
  async create(data: CreateInstructorDTO): Promise<InstructorDocument> {
    const instructor = new InstructorModel(data);
    return await instructor.save();
  }

  async addSchedule(id: string, newScheduleItem: any): Promise<InstructorDocument | null> {
    const instructor = await InstructorModel.findById(id);

    if (!instructor) {
      return null; // Instructor not found
    }

    instructor.availableSchedule.push(newScheduleItem);
    await instructor.save();

    return instructor;
  }


  async removeSchedule(id: string, scheduleItemId: string): Promise<InstructorDocument | null> {
    const instructor = await InstructorModel.findById(id);
  
    if (!instructor) {
      return null; // Instructor not found
    }
  
    const scheduleIndex = instructor.availableSchedule.findIndex(item => item._id.toString() === scheduleItemId);
  
    if (scheduleIndex !== -1) {
      instructor.availableSchedule.splice(scheduleIndex, 1);
      await instructor.save();
    }
  
    return instructor;
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
      throw new Error('User not found');
    }

    await InstructorModel.findByIdAndDelete(id);
  }
}

export { InstructorRepository };
