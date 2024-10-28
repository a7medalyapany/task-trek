import React from "react";

const TaskListSkeleton = () => {
  return (
    <div className="bg-card p-5 rounded-lg w-full h-full">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="bg-[#243859] p-3 mb-3 rounded-lg flex justify-between items-center animate-pulse"
        >
          <div className="h-6 bg-gray-600 rounded w-1/2"></div>
          <div className="h-6 bg-muted-foreground rounded-full w-16"></div>
        </div>
      ))}
      <div className="flex items-center">
        <div className="h-10 bg-gray-600 rounded w-full mr-2 animate-pulse"></div>
        <div className="h-10 bg-muted-foreground rounded-full w-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default TaskListSkeleton;
