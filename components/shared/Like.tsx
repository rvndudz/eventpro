import { useState, useEffect } from 'react';
import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { addLikeToEvent, removeLikeFromEvent, isEventLikedByUser } from '@/lib/actions/like.actions';

const Like = ({ event, userId }: { event: IEvent; userId: string }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Check if the user has already liked this event
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const liked = await isEventLikedByUser(event._id, userId);
        setIsLiked(liked);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [event._id, userId]);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await removeLikeFromEvent(event._id, userId);
        console.log('Disliked successfully!');
      } else {
        await addLikeToEvent({
          eventId: event._id,
          userId: userId,
          createdAt: new Date(),
        });
        console.log('Liked successfully!');
      }

      setIsLiked(!isLiked); // Toggle the liked state
    } catch (error) {
      console.error(`Failed to ${isLiked ? 'dislike' : 'like'}:`, error);
    }
  };

  return (
    <Button onClick={handleLikeToggle} type="button" size="lg" className="button sm:w-fit">
      {isLiked ? 'DISLIKE' : 'LIKE'}
    </Button>
  );
};

export default Like;
