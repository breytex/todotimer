import gql from 'graphql-tag'
import redirect from './redirect'

export const checkLoggedinUser = async context => {
  context.apolloClient
    .query({
      query: gql`
        query getLoggedin {
          loggedinUser {
            id
            email
          }
        }
      `,
    })
    .then(({ data }) => {
      return { loggedinUser: data }
    })
    .catch(() => {
      redirect(context, '/signin')
    })
}
