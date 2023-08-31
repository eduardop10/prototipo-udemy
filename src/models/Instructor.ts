import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface Instructor {
  name: string;
  email: string;
  password: string;
  specialty: string;
  isAdmin: boolean;
}

interface InstructorDocument extends Instructor, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const instructorSchema = new Schema<InstructorDocument>({
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
  specialty: { type: String, 
    required: true },
    isAdmin: { type: Boolean, default: false }, 
});

instructorSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

instructorSchema.methods.comparePassword = async function (candidatePassword: string) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const InstructorModel = model<InstructorDocument>('Instructor', instructorSchema);

export default InstructorModel;
export { Instructor, InstructorDocument };
