import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types';

interface TasksState {
  tasks: Task[];
  filter: {
    state: string | null;
    priority: string | null;
    search: string;
  };
}

const initialState: TasksState = {
  tasks: [],
  filter: {
    state: null,
    priority: null,
    search: '',
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<Partial<TasksState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

export const { addTask, updateTask, deleteTask, setFilter } = tasksSlice.actions;
export default tasksSlice.reducer;