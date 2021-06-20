import { eventModel } from '../../models/event'
import { userModel } from '../../models/user'
import { dateToString } from '../../helpers/date'

export const events = async (eventIds: any) => {
  try {
    const events = await eventModel.find({ _id: { $in: eventIds } })
    return events.map(
      (event: {
        _doc: { date: string | number | Date }
        id: any
        creator: any
      }) => {
        return transformEvent(event)
      }
    )
  } catch (err) {
    throw err
  }
}

export const singleEvent = async (eventId: any) => {
  try {
    const event = await eventModel.findById(eventId)
    return transformEvent(event)
  } catch (err) {
    throw err
  }
}

export const user = async (userId: any) => {
  try {
    const user = await userModel.findById(userId)
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    }
  } catch (err) {
    throw err
  }
}

export const transformEvent = (event: { _doc: any; id: any; creator: any }) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  }
}

export const transformBooking = (booking: {
  _doc: {
    user: any
    event: any
    createdAt: string | number | Date
    updatedAt: string | number | Date
  }
  id: any
}) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  }
}
