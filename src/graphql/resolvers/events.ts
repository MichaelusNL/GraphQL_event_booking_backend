import { eventModel } from '../../models/event'
import { transformEvent } from './merge'
import { userModel } from '../../models/user'

module.exports = {
  events: async () => {
    try {
      const events = await eventModel.find()
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
  },
  createEvent: async (args: {
    eventInput: {
      title: any
      description: any
      price: string | number
      date: string | number | Date
    }
  }) => {
    const event = new eventModel({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '60ce8defb493353620d4dcb5',
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = transformEvent(result)
      const creator = await userModel.findById('60ce8defb493353620d4dcb5')

      if (!creator) {
        throw new Error('User not found.')
      }
      creator.createdEvents.push(event)
      await creator.save()

      return createdEvent
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
