'use client'; // If using Next.js 13 app router

import { create } from 'zustand';
// Import server actions (if Next.js 13 Server Actions) OR
// import custom fetch wrappers that call an /api/ route
import {
  addLikeToEvent,
  removeLikeFromEvent,
  getLikedEventsByUser,
} from '@/lib/actions/like.actions';

interface LikeState {
  likedEvents: string[];
  fetchLikedEvents: (userId: string) => Promise<void>;
  toggleEventLike: (eventId: string, userId: string) => Promise<void>;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedEvents: [],

  fetchLikedEvents: async (userId) => {
    try {
      const eventIds = await getLikedEventsByUser(userId);
      set({ likedEvents: eventIds });
    } catch (error) {
      console.error('Error fetching liked events:', error);
    }
  },

  /**
   * Toggles like/unlike in both the DB and the store state.
   */
  toggleEventLike: async (eventId, userId) => {
    try {
      const currentState = get();
      const isAlreadyLiked = currentState.likedEvents.includes(eventId);

      if (isAlreadyLiked) {
        // 1) Remove from DB
        await removeLikeFromEvent(eventId, userId);
        // 2) Update store
        set({
          likedEvents: currentState.likedEvents.filter((id) => id !== eventId),
        });
      } else {
        // 1) Add to DB
        await addLikeToEvent({
          eventId,
          userId,
          createdAt: new Date(),
        });
        // 2) Update store
        set({
          likedEvents: [...currentState.likedEvents, eventId],
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  },
}));
