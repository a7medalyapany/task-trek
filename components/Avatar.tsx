"use client";

import Image from "next/image";
import { signOut } from "@/app/(auth)/actions";
import { useState, useRef, useEffect } from "react";

export default function Avatar({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    signOut();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Image
          src={avatarUrl}
          alt={name[0]}
          width={40}
          typeof="image/svg+xml"
          height={40}
          className="rounded-full"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background rounded-md shadow-lg z-10 text-foreground">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          <div className="py-1 border-t border-muted">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
