import { bookingModel } from '../../models/booking'
import { eventModel } from '../../models/event'
import { transformBooking, transformEvent } from './merge'

module.exports = {
  bookings: async () => {
    try {
      const bookings = await bookingModel.find()
      return bookings.map((booking: any) => {
        return transformBooking(booking)
      })
    } catch (err) {
      throw err
    }
  },
  bookEvent: async (args: any) => {
    const fetchedEvent = await eventModel.findOne({ _id: args.eventId })
    const booking = new bookingModel({
      user: '5c0fbd06c816781c518e4f3e',
      event: fetchedEvent,
    })
    const result = await booking.save()
    return transformBooking(result)
  },
  cancelBooking: async (args: any) => {
    try {
      const booking = await bookingModel
        .findById(args.bookingId)
        .populate('event')
      const event = transformEvent(booking.event)
      await bookingModel.deleteOne({ _id: args.bookingId })
      return event
    } catch (err) {
      throw err
    }
  },
}
