"use server";

import { Task } from "@/types";
import { createClient } from "./supabase/server";

export async function fetchUserTasks(): Promise<Task[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("No active session found");
  }
  const userId = user.id;
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateTasks(
  task: Partial<Task> & { id: string }
): Promise<Task> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("tasks")
      .update(task)
      .eq("id", task.id)
      .single();
    if (error) throw error;
    return data as Task;
  } catch (error) {
    console.error(error);
    return {} as Task;
  }
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) throw error;
    return taskId;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete task");
  }
}

export async function addTask(task: Omit<Task, "id">): Promise<Task> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("tasks").insert(task).single();
    if (error) throw error;
    return data as Task;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add task");
  }
}
