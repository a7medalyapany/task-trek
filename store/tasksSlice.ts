import { Task, State } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface TasksState {
  tasks: Task[];
  filter: {
    state: State | null;
    priority: string | null;
    search: string;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  filter: {
    state: null,
    priority: null,
    search: '',
  },
  status: 'idle',
  error: null,
};


export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return rejectWithValue("No active session found");

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id) // Fetch only current user's tasks
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
);

export const addTask = createAsyncThunk('tasks/addTask', async (task: Omit<Task, 'id'>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .single();
  if (error) throw error;
  return data as Task;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Partial<Task> & { id: string }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', task.id)
    .single();
  if (error) throw error;
  return data as Task;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  if (error) throw error;
  return taskId;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<TasksState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetTasks: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks.unshift(action.payload);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          const index = state.tasks.findIndex(task => task.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export const { setFilter, resetTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
