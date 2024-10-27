"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "../store/tasksSlice";

export default function SearchAndFilter() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    dispatch(setFilter({ search: value }));
  };

  const handleStateFilter = (value: string) => {
    dispatch(setFilter({ state: value === "all" ? null : value }));
  };

  const handlePriorityFilter = (value: string) => {
    dispatch(setFilter({ priority: value === "all" ? null : value }));
  };

  return (
    <div className="flex items-center space-x-4 text-foreground bg-transparent">
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="px-3 py-2 w-64 rounded-lg bg-card border border-muted text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <select
        onChange={(e) => handleStateFilter(e.target.value)}
        className="px-3 py-2 rounded-lg bg-card text-card-foreground border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">All States</option>
        <option value="todo">To Do</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <select
        onChange={(e) => handlePriorityFilter(e.target.value)}
        className="px-3 py-2 rounded-lg bg-card text-card-foreground border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
}
