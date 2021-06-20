import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import path from 'path'
import connectDB from './config/db'
import { graphQlSchema } from './graphql/schema/index'
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
})

const app = express()

app.use(isAuth)

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
)

connectDB()
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
)
