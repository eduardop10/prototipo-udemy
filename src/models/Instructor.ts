import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface Schedule {
  _id: string; 
  startTime: Date;
  endTime: Date;
}

interface Instructor {
  name: string;
  email: string;
  password: string;
  speciality: string;
  availableSchedule: Schedule[];
}

interface InstructorDocument extends Instructor, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const scheduleSchema = new Schema<Schedule>({
  
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const instructorSchema = new Schema<InstructorDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  speciality: { type: String, required: true },
  availableSchedule: [scheduleSchema],
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
export { Instructor, InstructorDocument, Schedule };
