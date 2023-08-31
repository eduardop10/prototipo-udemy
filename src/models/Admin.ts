import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface Admin {
  name:string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface AdminDocument extends Admin, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<AdminDocument>({
  name: { type: String, default: 'Admin'},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true }, 
});

AdminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  

  AdminSchema.methods.comparePassword = async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  };

const AdminModel = model<AdminDocument>('Admin', AdminSchema);

export default AdminModel;
export { Admin, AdminDocument };
