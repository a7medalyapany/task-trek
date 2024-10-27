import React, { FC } from "react";

interface layoutProps {
  children?: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className=" h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {children}
    </div>
  );
};

export default layout;
