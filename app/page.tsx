import TaskCard from "@/components/TaskCard";

export default function Home() {
  return (
    <div className="flex-1 flex justify-around gap-x-4 px-4 md:px-8 lg:px-16 overflow-x-auto py-8">
      <TaskCard title="todo" />
      <TaskCard title="doing" />
      <TaskCard title="done" />
    </div>
  );
}
