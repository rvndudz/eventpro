"use client";

import React, { useState } from "react";
import Image from "next/image";

type LoveButtonProps = {
  initialLiked?: boolean; // Optional prop to set initial liked state
  onToggle?: (isLiked: boolean) => void; // Callback function for parent
  size?: number; // Optional size for the button
};

const LoveButton = ({ initialLiked = false, onToggle, size = 24 }: LoveButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  const handleToggle = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (onToggle) {
      onToggle(newLikedState); // Notify parent component
    }
    // Optional: Add API call here to persist the like state
  };

  return (
    <div
      onClick={handleToggle}
      className={`cursor-pointer rounded-full p-2 shadow-sm transition-all hover:bg-gray-100 ${
        isLiked ? "bg-red-100" : "bg-white"
      }`}
      style={{ width: size + 8, height: size + 8 }}
    >
      <Image
        src={isLiked ? "/icons/heart-filled.svg" : "/icons/heart-outline.svg"}
        alt={isLiked ? "Loved" : "Not loved"}
        width={size}
        height={size}
        style={{
          filter: isLiked ? "invert(20%) sepia(90%) saturate(500%) hue-rotate(-10deg)" : "none",
        }}
      />
    </div>
  );
};

export default LoveButton;