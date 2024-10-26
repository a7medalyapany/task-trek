import { FC, useState } from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle, Clock, Pencil, Trash } from "lucide-react";
import { Task } from "../types";
import { motion } from "framer-motion";

interface ViewTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const ViewTask: FC<ViewTaskProps> = ({ task, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    Low: "bg-green-500",
    Medium: "bg-yellow-500",
    High: "bg-red-500",
  };

  const stateIcons = {
    todo: <AlertCircle size={16} className="text-blue-500" />,
    doing: <Clock size={16} className="text-yellow-500" />,
    done: <CheckCircle size={16} className="text-green-500" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-secondary rounded-lg shadow-md overflow-hidden mb-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {task.image && (
        <Image
          src={task.image}
          alt={task.title}
          width={600}
          height={600}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
        <p className="text-sm text-gray-400 mb-3">{task.description}</p>
        <div className="flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <div className="flex items-center">
            {stateIcons[task.state]}
            <span className="ml-1 text-sm">{task.state}</span>
          </div>
        </div>
      </div>
      {isHovered && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            className="bg-gray-800 p-1.5 rounded-full opacity-75 hover:opacity-100 transition-opacity"
            onClick={() => onEdit(task)}
          >
            <Pencil size={16} />
          </button>
          <button
            className="bg-gray-800 p-1.5 rounded-full opacity-75 hover:opacity-100 transition-opacity text-red-500"
            onClick={() => onDelete(task.id)}
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ViewTask;
