import withApollo from 'next-with-apollo'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getBackendUrl } from '../configs'

export default withApollo(({ ctx, headers, initialState }) => {
  const linkConfig = {
    uri: getBackendUrl(),
    credentials: 'include',
  }

  if (!process.browser) {
    // if server-side: forward client headers (cookies!) with every apollo request
    linkConfig.headers = headers
  }

  const link = createHttpLink(linkConfig)
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState || {}),
    link,
  })
})