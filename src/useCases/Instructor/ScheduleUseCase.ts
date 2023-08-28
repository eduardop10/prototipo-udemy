import { InstructorRepository } from '../../repositories/Instructor';
import { InstructorDocument } from '../../models/Instructor';

class ScheduleUseCase {
  private instructorRepository: InstructorRepository;

  constructor(instructorRepository: InstructorRepository) {
    this.instructorRepository = instructorRepository;
  }

  async addSchedule(instructorId: string, newScheduleItem: any): Promise<InstructorDocument | null> {
    try {
      return await this.instructorRepository.addSchedule(instructorId, newScheduleItem);
    } catch (error) {
      throw new Error(`Ocorreu um erro ao adicionar o agendamento ${error}`);
    }
  }

   async removeSchedule(instructorId: string, scheduleItemId: string): Promise<InstructorDocument | null> {
    try {
      return await this.instructorRepository.removeSchedule(instructorId, scheduleItemId);
    } catch (error) {
      throw new Error('Ocorreu um erro ao remover o agendamento');
    }
  }
}

export { ScheduleUseCase };
