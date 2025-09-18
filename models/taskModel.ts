import mongoose, { Schema, Document } from "mongoose";

export interface ITaskItem {
  title: string;
  description?: string;
  duration?: number;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "completed";
  dueDate?: Date;
  value?: number;
}

export interface ITask extends Document {
  subject: string;
  time: string;
  difficulty: string;
  tasks: ITaskItem[];
}

const taskItemSchema = new Schema<ITaskItem>(
  {
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    dueDate: { type: Date },
    value: { type: Number },
  },
  { _id: false } // don't create _id for sub-docs
);

const taskSchema = new Schema<ITask>(
  {
    subject: { type: String, required: true },
    time: { type: String, required: true },
    difficulty: { type: String, required: true },
    tasks: { type: [taskItemSchema], default: [] }, // ✅ Array of objects
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
