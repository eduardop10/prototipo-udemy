import { Request, Response } from 'express';
import { attachCookiesToResponse,  createJWT, } from '../../utils/jwt';
import { RegisterUseCase, LoginUseCase, UpdateUseCase, DeleteUseCase } from '../../useCases/Student/AuthUseCase';
import { CreateStudentDTO } from '../../dtos/Student/CreateStudent';
import { UpdateStudentDTO } from '../../dtos/Student/UpdateStudent';
import { StudentRepository } from '../../repositories/Student';
import bcrypt from 'bcrypt';

class AuthController {
    async register(req: Request, res: Response) {
        try {
          const { name, email, password, roles } = req.body;
    
          const studentRepository = new StudentRepository();
          const registerUseCase = new RegisterUseCase(studentRepository);
    
          const StudentData: CreateStudentDTO = {
            name,
            email,
            password
          };
    
          const newStudent = await registerUseCase.execute(StudentData);
    
          res.status(200).json({
            message: 'Student registered successfully',
            Student: newStudent,
          });
        } catch (error) {
          res.status(500).json({
            error: `An error occurred while registering the Student: ${error}`,
          });
        }
      }

      async login(req: Request, res: Response) {
        try {
          const { email, password } = req.body;

          const studentRepository = new StudentRepository();
          const loginUseCase = new LoginUseCase(studentRepository);

          
          const Student = await loginUseCase.execute(email);

          interface StudentPayload {
            _id: string;
            name:string;
          }
          if (!Student) {
            return res.status(401).json({
              error: 'Invalid credentials',
            });
          }
    
          const isPasswordValid = await Student.comparePassword(password);
    
          if (!isPasswordValid) {
            return res.status(401).json({
              error: 'Invalid credentials',
            });
          }
          
          // Generate a JWT token and attach it to cookies during login
          const StudentPayload: StudentPayload = {
            name:Student.name,
            _id: Student._id,
      };
      
          // Generate a JWT token and attach it to cookies during login
          // You should implement this part using your JWT library
          const token = createJWT(StudentPayload);
    
          // Attach cookies to response
          // You should implement this part based on your attachCookiesToResponse function
          attachCookiesToResponse(res, StudentPayload);
    
          res.status(200).json({
            message: 'Login successful',
            StudentPayload,
            token
          });
        } catch (error) {
          res.status(500).json({
            error: `An error occurred while logging in : ${error}`,
          });
        }
      }

      async update(req: Request, res: Response) {
        try {
          const userId = req.user!._id; // Assuming you're passing user ID in the URL
          const { name, email, password, roles } = req.body;
          const requesterId = userId// User ID from token
    
          const studentRepository = new StudentRepository();
          const updateUserUseCase = new UpdateUseCase(studentRepository);
          
          // Hash the new password before updating
          const hashedPassword = await bcrypt.hash(password, 10);

          const updateData: UpdateStudentDTO = {
            name,
            email,
            password:hashedPassword,
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
          const userId = req.user!._id; // Assuming you're passing user ID in the URL
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


export {AuthController}
