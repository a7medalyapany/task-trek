export type Priority = 'Low' | 'Medium' | 'High';
export type State = 'todo' | 'doing' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  state: State;
  image?: string;
}