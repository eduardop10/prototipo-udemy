import { Request, Response } from 'express';
import { InstructorRepository } from '../../repositories/Instructor';
import { ScheduleUseCase } from '../../useCases/Instructor/ScheduleUseCase';

const instructorRepository = new InstructorRepository();
const scheduleUseCase = new ScheduleUseCase(instructorRepository);

class ScheduleController {
  async addSchedule(req: Request, res: Response) {
    const instructorId = req.user!._id;
    const newScheduleItem = req.body;

    try {
      const updatedInstructor = await scheduleUseCase.addSchedule(instructorId, newScheduleItem);
      if (!updatedInstructor) {
        return res.status(404).json({ error: 'Instrutor não encontrado' });
      }
      return res.json(updatedInstructor);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Ocorreu um erro ao adicionar o agendamento ${error}` });
    }
  }

   async removeSchedule(req: Request, res: Response) {
    const instructorId = req.user!._id;
    const scheduleItemId = req.params.scheduleId;

    try {
      const updatedInstructor = await scheduleUseCase.removeSchedule(instructorId, scheduleItemId);
      if (!updatedInstructor) {
        return res.status(404).json({ error: 'Instrutor não encontrado' });
      }
      return res.json(updatedInstructor);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ocorreu um erro ao remover o agendamento' });
    }
  } 
}

export { ScheduleController };
