import { Request, Response } from 'express';
import { attachCookiesToResponse,  createJWT, } from '../../utils/jwt';
import { LoginAdminUseCase } from '../../useCases/Admin/AuthUseCase';
import { CreateStudentDTO } from '../../dtos/Student/CreateStudent';
import { UpdateStudentDTO } from '../../dtos/Student/UpdateStudent';
import { StudentRepository } from '../../repositories/Student';
import { AdminRepository } from '../../repositories/Admin'
import { AdminDocument } from '../../models/Admin';
import bcrypt from 'bcrypt';
import { NotFoundError, UnauthorizedError } from '../../errors';

class AuthController {

      async login(req: Request, res: Response) {
          const { email, password } = req.body;

          const adminRepository = new AdminRepository();
          const loginUseCase = new LoginAdminUseCase(adminRepository);

          
          const Admin = await loginUseCase.execute(email);

          if (!Admin) {
            throw new UnauthorizedError('Invalid credentials')
          }
          interface AdminPayload {
            name:string;
            _id: string;
            isAdmin:boolean;
          }
          
          const isPasswordValid = await Admin.comparePassword(password);
          

          if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials')
          }
          
          // Generate a JWT token and attach it to cookies during login
          const AdminPayload: AdminPayload = {
            name:Admin!.name,
            _id: Admin!._id,
            isAdmin: Admin!.isAdmin
      };
      
          // Generate a JWT token and attach it to cookies during login
          // You should implement this part using your JWT library
          const token = createJWT(AdminPayload);
    
          // Attach cookies to response
          // You should implement this part based on your attachCookiesToResponse function
          attachCookiesToResponse(res, AdminPayload);
    
          res.status(200).json({
            message: 'Login successful',
            AdminPayload,
            token
          });
        
      }
/* 
      async update(req: Request, res: Response) {
      
          const userId = req.user!._id; // Assuming you're passing user ID in the URL
          const { name, email, password} = req.body;
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
            new NotFoundError('User not found')
          }
    
          res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
          });
        
      } */
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
