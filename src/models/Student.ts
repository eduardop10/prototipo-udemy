import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface Student {
  name: string;
  email:string;
  password:string;
}

interface StudentDocument extends Student, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const StudentSchema = new Schema<StudentDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
