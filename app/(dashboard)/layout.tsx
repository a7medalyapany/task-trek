import { FC } from "react";
import Nav from "@/components/Nav";

interface layoutProps {
  children?: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <Nav />
      {children}
    </div>
  );
};

export default layout;
