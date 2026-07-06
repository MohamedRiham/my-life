export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export type Task = {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  start_at: string | null;
  end_at: string | null;
  is_completed: number;
  created_at: string;
  updated_at: string;
};

export type SubTask = Pick<Task, 'id' | 'user_id' | 'title' | 'description' | 'is_completed'> & {
  task_id: number;
  created_at: string;
  updated_at: string;
};
