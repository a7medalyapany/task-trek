"use client";

import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { useDispatch } from "react-redux";
import { HTML5Backend } from "react-dnd-html5-backend";

import { State } from "@/types";
import { AppDispatch } from "@/store/store";
import TaskCard from "@/components/TaskCard";
import { createClient } from "@/lib/supabase/client";
import { updateTask, fetchTasks } from "@/store/tasksSlice";
import SkeletonCard from "@/components/SkeletonCard";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndSubscribe = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const subscription = supabase
        .channel("tasks")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tasks" },
          () => {
            dispatch(fetchTasks());
          }
        )
        .subscribe();

      if (user) {
        await dispatch(fetchTasks());
      }

      setLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    fetchUserAndSubscribe();
  }, [dispatch]);

  const onDrop = (itemId: string, newState: State) => {
    dispatch(updateTask({ id: itemId, state: newState }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex justify-around gap-x-4 px-4 md:px-8 lg:px-16 overflow-x-auto py-8">
        {loading ? (
          <div className="flex w-full justify-between items-center gap-6 p-10 h-full">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            <TaskCard title="todo" onDrop={onDrop} />
            <TaskCard title="doing" onDrop={onDrop} />
            <TaskCard title="done" onDrop={onDrop} />
          </>
        )}
      </div>
    </DndProvider>
  );
}
