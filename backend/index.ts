import cookieParser = require('cookie-parser')
import { GraphQLServer } from 'graphql-yoga'
import { Context } from 'graphql-yoga/dist/types'
import "reflect-metadata"


import * as cors from 'cors'
import { resolvers } from './src/resolvers'
import { createTypeormConn } from './src/typeormConnection'
import { MyContext } from './src/types'
import { createSchema } from './src/utils/createSchema'

(async () => {

  await createTypeormConn()
  const schema = await createSchema()

  const server = new GraphQLServer({
    context: ({ response, request }: Context): MyContext => {
      return {
        response,
        request,
        user: null,
        session: null,
      }
    },
    schema,
    resolvers,
    debug: true,
  } as any)


  let corsOrigin = "prod_url"
  if (process.env.NODE_ENV === "development") {
    corsOrigin = "http://localhost:3000"
  }

  const opts = {
    port: 4000,
    endpoint: '/api',
    subscriptions: '/api/subscriptions',
    playground: '/api/playground',
    cors: { origin: corsOrigin, methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'], credentials: true }
  }

  // server.express.enable('trust proxy')

  server.express.use(cookieParser())

  server.start(opts, () => console.log('Server is running on http://localhost:4000'))

})().catch(e => { console.error(e) })

