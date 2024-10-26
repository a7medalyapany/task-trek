"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "../store/tasksSlice";

const Nav = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(setFilter({ search: value }));
  };

  const handleStateFilter = (state: string | null) => {
    dispatch(setFilter({ state }));
  };

  const handlePriorityFilter = (priority: string | null) => {
    dispatch(setFilter({ priority }));
  };

  return (
    <nav className="bg-background/70 backdrop-blur-md border-b border-secondary h-16 flex items-center justify-center px-4 shadow-lg">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearch}
          className="px-3 py-2 rounded-lg bg-card border border-muted text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          onChange={(e) => handleStateFilter(e.target.value || null)}
          className="px-3 py-2 rounded-lg bg-card text-card-foreground border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All States</option>
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <select
          onChange={(e) => handlePriorityFilter(e.target.value || null)}
          className="px-3 py-2 rounded-lg bg-card text-card-foreground border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </nav>
  );
};

export default Nav;
