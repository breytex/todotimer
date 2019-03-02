import gql from 'graphql-tag'
import redirect from './redirect'

export const checkLoggedinUser = async context => {
  if (!process.browser) {
    console.log('fetching initial user...')
    // fetch user on initial page load only (server side)
    // assuming a user is already fetched when the app runs client-side
    try {
      const response = await context.apolloClient.query({
        query: gql`
          query getLoggedin {
            loggedinUser {
              id
              email
            }
          }
        `,
      })
      return { user: response.data.loggedinUser }
    } catch (e) {
      redirect(context, '/signin')
    }
  } else {
    return { user: null }
  }
}
