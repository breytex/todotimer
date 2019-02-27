import withApollo from 'next-with-apollo'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { getBackendUrl } from '../configs'

export default withApollo(
  ({ ctx, headers, initialState }) => {
    return new ApolloClient({
      uri: getBackendUrl(),
      cache: new InMemoryCache().restore(initialState || {}),
    })
  }

)