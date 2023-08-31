import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface Student {
  name: string;
  email:string;
  password:string;
  isAdmin: boolean;
}

interface StudentDocument extends Student, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const StudentSchema = new Schema<StudentDocument>({
  name: { type: String, 
    required: [true, 'Please provide name'], },
  email: { type: String,  
    required: [true, 'Please provide email'], 
    unique: true, 
    match: [emailRegex, 'Please provide a valid email address'],},
  password: { type: String, 
    minlength:8, 
    required: [true, 'Please provide password'], 
    match: [passwordRegex, 'Password must contain at least 8 characters, including one lowercase letter, one uppercase letter, and one digit'], },
    isAdmin: { type: Boolean, default: false }, 
});

StudentSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  

StudentSchema.methods.comparePassword = async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  };

const StudentModel = model<StudentDocument>('Student', StudentSchema);

export default StudentModel;
export { Student, StudentDocument };
