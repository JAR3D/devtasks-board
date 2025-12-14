import TasksClient from './ui/TasksClient';
import { connectToDatabase } from '@/lib/db';
import { Task } from '@/lib/models/Task';

const TasksPage = async () => {
  await connectToDatabase();
  const tasks = await Task.find().sort({ createdAt: -1 }).lean();

  return <TasksClient tasks={tasks} />;
};

export default TasksPage;
