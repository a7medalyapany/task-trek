export type Priority = 'Low' | 'Medium' | 'High';
export type State = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  image?: string;
  priority: Priority;
  state: State;
  created_at?: string;
  updated_at?: string;
}

export interface UpdatedTask {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  state: "todo" | "doing" | "done";
  image?: string;
}