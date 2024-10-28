"use client";
import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
  addTask,
  updateTask,
  deleteTask,
  fetchTasks,
} from "../store/tasksSlice";
import ViewTask from "./ViewTask";
import EditTaskModal from "./EditTaskModal";
import { Task, State } from "../types";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrop } from "react-dnd";
import { AppDispatch } from "../store/store";
import { createClient } from "@/lib/supabase/client";

const selectTasks = createSelector(
  (state: RootState) => state.tasks.tasks || [],
  (state: RootState) => state.tasks.filter || {},
  (tasks, filter) =>
    tasks.filter(
      (task) =>
        (!filter.state || task.state === filter.state) &&
        (!filter.priority || task.priority === filter.priority) &&
        (!filter.search ||
          task.title.toLowerCase().includes(filter.search.toLowerCase()))
    )
);

export default function TaskCard({
  title,
  onDrop,
}: {
  title: State;
  onDrop: (id: string, state: State) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const allTasks = useSelector(selectTasks);
  const status = useSelector((state: RootState) => state.tasks.status);
  const tasks = useMemo(
    () => (allTasks ? allTasks.filter((task) => task.state === title) : []),
    [allTasks, title]
  );

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (updatedTask: Task) => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        dispatch(updateTask({ ...updatedTask, user_id: user.id }));
        setEditingTask(null);
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleAddTask = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (newTaskTitle.trim()) {
      const newTask: Omit<Task, "id"> = {
        title: newTaskTitle.trim(),
        description: "",
        priority: "Medium",
        state: title,
        user_id: user!.id, // Replace with actual user ID
      };
      dispatch(addTask(newTask));
      setNewTaskTitle("");
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string }) => onDrop(item.id, title),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ref={drop}
      className={`flex-grow w-80 bg-card/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl text-white ${
        isOver && canDrop ? "bg-blue-600" : ""
      }`}
    >
      <h2 className="p-4 font-bold text-lg text-card-foreground capitalize">
        {title}
      </h2>
      <div
        className="px-2 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 15rem)" }}
      >
        <AnimatePresence>
          {tasks.map((task, index) => (
            <ViewTask
              key={task.id}
              task={task}
              index={index}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="p-3 pt-0 rounded-b-lg"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-grow rounded-lg bg-transparent border-t drop-shadow-lg border-l border-gray-600 p-2 text-white"
          />
          <button onClick={handleAddTask}>
            <Plus size={36} />
          </button>
        </div>
      </motion.footer>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
