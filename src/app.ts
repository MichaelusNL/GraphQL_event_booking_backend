import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import path from 'path'

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
})

const app = express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
        events: [String!]!
    }

    type RootMutation {
        createEvent(name: String): String
    }

    schema {
        query: RootQuery 
        mutation: RootMutation
    }
    
    `),
    rootValue: {
      events: () => {
        return ['Romantic Cooking', 'sailing', 'All night coding']
      },
      createEvent: (args: any): string => {
        const eventName = args.name
        return eventName
      },
    },
    graphiql: true,
  })
)

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
)
