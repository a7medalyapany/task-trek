"use client";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { addTask, updateTask, deleteTask } from "../store/tasksSlice";
import ViewTask from "./ViewTask";
import EditTaskModal from "./EditTaskModal";
import { Task, State } from "../types";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrop } from "react-dnd";

const selectTasks = createSelector(
  (state: RootState) => state.tasks.tasks,
  (state: RootState) => state.tasks.filter,
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
  onDrop: (id: number, state: string) => void;
}) {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectTasks);
  const tasks = useMemo(
    () => allTasks.filter((task) => task.state === title),
    [allTasks, title]
  );

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (updatedTask: Task) => {
    dispatch(updateTask(updatedTask));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle.trim(),
        description: "",
        priority: "Medium",
        state: title,
      };
      dispatch(addTask(newTask));
      setNewTaskTitle("");
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: number }) => onDrop(item.id, title),
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
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
