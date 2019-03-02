import withApollo from 'next-with-apollo'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getBackendUrl } from '../configs'

export default withApollo(({ ctx, headers, initialState }) => {
  console.log(getBackendUrl())
  const link = createHttpLink({
    uri: getBackendUrl(),
    credentials: 'include',
  })
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState || {}),
    link,
  })
})
