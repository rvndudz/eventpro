import { useEffect } from 'react';
import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { useLikeStore } from '@/lib/store/like.store';
import Image from "next/image";

function Like({ event, userId }: { event: IEvent; userId: string }) {
  const { likedEvents, fetchLikedEvents, toggleEventLike } = useLikeStore();

  useEffect(() => {
    // Fetch the user's liked events when this component mounts
    // (or whenever userId changes).
    fetchLikedEvents(userId);
  }, [userId, fetchLikedEvents]);

  // Check if this particular event is liked by seeing if its ID is in likedEvents
  const isLiked = likedEvents.includes(event._id);

  // Toggle like/unlike in both server and store
  const handleLikeToggle = async () => {
    await toggleEventLike(event._id, userId);
  };

  return (
    <div
      onClick={handleLikeToggle}
      className={`cursor-pointer rounded-full p-2 shadow-sm transition-all hover:bg-gray-100 ${
        isLiked ? "bg-red-100" : "bg-white"
      }`}
      style={{ width:   35, height:  35 }}
    >
      <Image
        src={isLiked ? "/icons/heart-filled.svg" : "/icons/heart-outline.svg"}
        alt={isLiked ? "Loved" : "Not loved"}
        width={50}
        height={50}
        style={{
          filter: isLiked ? "invert(20%) sepia(90%) saturate(500%) hue-rotate(-10deg)" : "none",
        }}
      />
    </div>
  );
}

export default Like;
