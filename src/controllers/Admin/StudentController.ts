import { Request, Response } from 'express';
import { attachCookiesToResponse,  createJWT, } from '../../utils/jwt';
import { UpdateUseCase, DeleteUseCase  } from '../../useCases/Student/AuthUseCase';
import { CreateStudentDTO } from '../../dtos/Student/CreateStudent';
import { UpdateStudentDTO } from '../../dtos/Student/UpdateStudent';
import { StudentRepository } from '../../repositories/Student';
import bcrypt from 'bcrypt';

class StudentController {
    async showAll(req: Request, res: Response) {
    
          const studentRepository = new StudentRepository();
    
          const allStudents = await studentRepository.findAll()
    
          if (!allStudents) {
            return res.status(404).json({
              error: 'Empty',
            });
          }
    
          res.status(200).json({
            Students: allStudents,
          });
      }

      async findOne(req: Request, res: Response) {
        const id = req.params.id; 
  
        const studentRepository = new StudentRepository();
  
        const student = await studentRepository.findById(id)
  
        if (!student ) {
          return res.status(404).json({
            error: 'User Not Found',
          });
        }
  
        res.status(200).json({
           student,
        });
    }

      async update(req: Request, res: Response) {
        try {
          const userId = req.params.id; // Assuming you're passing user ID in the URL
          const { name, email, password, specialty } = req.body;
          const requesterId = userId// User ID from token
    
          const studentRepository = new StudentRepository();
          const updateUserUseCase = new UpdateUseCase(studentRepository);
          
          // Hash the new password before updating
          const hashedPassword = await bcrypt.hash(password, 10);

          const updateData: UpdateStudentDTO = {
            name,
            email,
            password:hashedPassword
          };
    
          const updatedUser = await updateUserUseCase.execute(userId, updateData, requesterId);
    
          if (!updatedUser) {
            return res.status(404).json({
              error: 'User not found',
            });
          }
    
          res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
          });
        } catch (error) {
          res.status(500).json({
            error: `An error occurred while updating the user: ${error}`,
          });
        }
      }
      async delete(req: Request, res: Response) {
        try {
          const userId = req.params.id; // Assuming you're passing user ID in the URL
          const requesterId = userId; // User ID from token
      
          const studentRepository = new StudentRepository();
          const deleteUseCase = new DeleteUseCase(studentRepository);
      
          // Execute the delete operation
          await deleteUseCase.execute(userId, requesterId);
      
          res.status(200).json({
            message: 'User deleted successfully',
          });
        } catch (error) {
          res.status(500).json({
            error: `An error occurred while deleting the user: ${error}`,
          });
        }
      }
      
    }
    
/*   async logout(req: Request, res: Response) {
    try {
      // Clear the token cookie
      res.clearCookie('token');

      res.status(200).json({
        message: 'Logged out successfully',
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while logging out',
      });
    }
  } */


export {StudentController}
