import { Task, State } from "@/types";
import {
  addTask as _addTask,
  updateTasks,
  deleteTask as _deleteTask,
  fetchUserTasks,
} from "@/lib/task.action";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface TasksState {
  tasks: Task[];
  filter: {
    state: State | null;
    priority: string | null;
    search: string;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  filter: {
    state: null,
    priority: null,
    search: "",
  },
  status: "idle",
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const tasks = await fetchUserTasks();
  return tasks;
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: Omit<Task, "id">) => {
    const addedTask = _addTask(task);
    return addedTask;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Partial<Task> & { id: string }) => {
    const updatedTasks = await updateTasks(task);
    return updatedTasks;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    const deletedTask = await _deleteTask(taskId);
    return deletedTask;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<Partial<TasksState["filter"]>>
    ) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetTasks: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks.unshift(action.payload);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          const index = state.tasks.findIndex(
            (task) => task.id === action.payload.id
          );
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const { setFilter, resetTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
