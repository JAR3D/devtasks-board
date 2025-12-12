import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    descrition: String,
    status: {
      type: String,
      enum: ['BACKLOG', 'IN_PROGRESS', 'DONE'],
      default: 'BACKLOG',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
);

export type TTaskDocument = mongoose.InferSchemaType<typeof taskSchema> & {
  _id: string;
};

export const Task = mongoose.model<TTaskDocument>('Task', taskSchema);
