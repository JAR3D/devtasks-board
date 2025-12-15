import TasksClient from './ui/TasksClient';
import { connectToDatabase } from '@/lib/db';
import { Task } from '@/lib/models/Task';

import type { ITaskDTO } from '@/lib/types/taskTypes';

const TasksPage = async () => {
  await connectToDatabase();
  const tasks = await Task.find().sort({ createdAt: -1 }).lean();

  const safeTasks: ITaskDTO[] = tasks.map((task) => ({
    _id: task._id.toString(),
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    tags: task.tags ?? [],
    createdAt: task.createdAt ? new Date(task.createdAt).toISOString() : null,
    updatedAt: task.updatedAt ? new Date(task.updatedAt).toISOString() : null,
  }));

  return <TasksClient tasks={safeTasks} />;
};

export default TasksPage;
