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
      className="cursor-pointer rounded-full bg-white p-2 shadow-sm transition-all hover:bg-gray-100"
      style={{ width: size + 8, height: size + 8 }}
    >
      <Image
        src={isLiked ? "/assets/icons/heart-filled.svg" : "/assets/icons/heart-outline.svg"}
        alt={isLiked ? "Loved" : "Not loved"}
        width={size}
        height={size}
      />
    </div>
  );
};

export default LoveButton;
