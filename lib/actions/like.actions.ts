"use server";

import {
  AddLikeParams,
  RemoveLikeParams
} from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Like, { ILike } from "../database/models/like.model";
import Event from "../database/models/event.model";
import { ObjectId } from "mongodb";
import User from "../database/models/user.model";

// ADD LIKE TO EVENT
export const addLikeToEvent = async (like: AddLikeParams) => {
  console.log('addLikeToEvent function called with:', like);

  try {
    await connectToDatabase();
    console.log('Database connected successfully');

    const newLike = await Like.create({
      createdAt: like.createdAt,
      event: like.eventId,
      liker: like.userId, // Assuming `buyer` is mapped to the `userId`
    });

    console.log('Like created successfully:', newLike);
    return JSON.parse(JSON.stringify(newLike));
  } catch (error) {
    console.error('Error creating like:', error);
    handleError(error);
  }
};


// REMOVE LIKE FROM EVENT
export const removeLikeFromEvent = async (eventId: string, userId: string) => {
  try {
    await connectToDatabase();
    console.log('Database connected successfully');

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Find and remove the like
    const like = await Like.findOneAndDelete({ event: eventId, liker: userId });
    if (!like) {
      console.log('Like not found for this user and event.');
      return { message: 'Like not found' }; // Optional: Return a message if the like doesn't exist
    }

    console.log('Like removed successfully:', like);
    return JSON.parse(JSON.stringify(like));
  } catch (error) {
    console.error('Error removing like:', error);
    handleError(error); // This is your custom error handler
  }
};

// CHECK IF USER LIKED AN EVENT
export const isEventLikedByUser = async (eventId: string, userId: string): Promise<boolean> => {
  try {
    await connectToDatabase();

    const like = await Like.findOne({ event: eventId, liker: userId });
    return !!like; // Return true if the like exists, otherwise false
  } catch (error) {
    console.error("Error checking if event is liked by user:", error);
    throw new Error("Failed to check like status");
  }
};

export async function getLikedEventsByUser(userId: string): Promise<string[]> {
  try {
    await connectToDatabase();
    const likes = await Like.find({ liker: userId }).select('event');
    // Each "like" has `like.event` as an ObjectId; convert to string
    return likes.map((like) => like.event.toString());
  } catch (error) {
    console.error('Error in getLikedEventsByUser:', error);
    return [];
  }
}