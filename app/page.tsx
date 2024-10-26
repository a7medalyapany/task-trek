"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch } from "react-redux";
import { moveTask } from "../store/tasksSlice";
import TaskCard from "@/components/TaskCard";

export default function Home() {
  const dispatch = useDispatch();

  const onDrop = (itemId: number, newState: string) => {
    dispatch(moveTask({ taskId: itemId, newState }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex justify-around gap-x-4 px-4 md:px-8 lg:px-16 overflow-x-auto py-8">
        <TaskCard title="todo" onDrop={onDrop} />
        <TaskCard title="doing" onDrop={onDrop} />
        <TaskCard title="done" onDrop={onDrop} />
      </div>
    </DndProvider>
  );
}
