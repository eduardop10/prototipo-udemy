import { Request, Response } from 'express';
import { attachCookiesToResponse,  createJWT, } from '../../utils/jwt';
import { RegisterUseCase, LoginUseCase, UpdateUseCase, DeleteUseCase  } from '../../useCases/Instructor/AuthUseCase';
import { CreateInstructorDTO } from '../../dtos/Instructor/CreateInstructor';
import { UpdateInstructorDTO } from '../../dtos/Instructor/UpdateInstructor';
import { InstructorRepository } from '../../repositories/Instructor';
import bcrypt from 'bcrypt';

class AuthController {
    async register(req: Request, res: Response) {
        try {
          const { name, email, password, speciality } = req.body;
    
          const instructorRepository = new InstructorRepository();
          const registerUseCase = new RegisterUseCase(instructorRepository);
    
          const InstructorData: CreateInstructorDTO = {
            name,
            email,
            password,
            speciality
          };
    
          const newInstructor = await registerUseCase.execute(InstructorData);
    
          res.status(200).json({
            message: 'Instructor registered successfully',
            Instructor: newInstructor,
          });
        } catch (error) {
          res.status(500).json({
            error: `An error occurred while registering the Instructor: ${error}`,
          });
        }
      }

      async login(req: Request, res: Response) {
        try {
          const { email, password } = req.body;

          const instructorRepository = new InstructorRepository();
          const loginUseCase = new LoginUseCase(instructorRepository);

          
          const Instructor = await loginUseCase.execute(email);

          interface InstructorPayload {
            _id: string;
            name:string;
          }
          if (!Instructor) {
            return res.status(401).json({
              error: 'Invalid credentials',
            });
          }
    
          const isPasswordValid = await Instructor.comparePassword(password);
    
          if (!isPasswordValid) {
            return res.status(401).json({
              error: 'Invalid credentials',
            });
          }
          
          // Generate a JWT token and attach it to cookies during login
          const InstructorPayload: InstructorPayload = {
            name:Instructor.name,
            _id: Instructor._id,
      };
      
          // Generate a JWT token and attach it to cookies during login
          // You should implement this part using your JWT library
          const token = createJWT(InstructorPayload);
    
          // Attach cookies to response
          // You should implement this part based on your attachCookiesToResponse function
          attachCookiesToResponse(res, InstructorPayload);
    
          res.status(200).json({
            message: 'Login successful',
            InstructorPayload,
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
          const { name, email, password, speciality } = req.body;
          const requesterId = userId// User ID from token
    
          const instructorRepository = new InstructorRepository();
          const updateUserUseCase = new UpdateUseCase(instructorRepository);
          
          // Hash the new password before updating
          const hashedPassword = await bcrypt.hash(password, 10);

          const updateData: UpdateInstructorDTO = {
            name,
            email,
            password:hashedPassword,
            speciality
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
      
          const instructorRepository = new InstructorRepository();
          const deleteUseCase = new DeleteUseCase(instructorRepository);
      
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
