import { Schema, model, models, Document } from 'mongoose'

export interface ILike extends Document {
  createdAt: Date
  event: {
    _id: string
    title: string
  }
  user: {
    _id: string
    firstName: string
    lastName: string
  }
}

export type ILikeItem = {
  _id: string
  createdAt: Date
  eventTitle: string
  eventId: string
  user: string
}

const LikeSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Like = models.Like || model('Like', LikeSchema)

export default Like
