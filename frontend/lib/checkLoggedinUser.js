import gql from 'graphql-tag'
import redirect from './redirect'

const user = { id: null, email: null }

export const setUser = newUser => {
  for (let key in user) {
    if (user.hasOwnProperty(key)) {
      user[key] = newUser[key]
    }
  }
}

export const checkLoggedinUser = async context => {
  try {
    await context.apolloClient.query({
      query: gql`
        query getLoggedin {
          loggedinUser {
            id
            email
          }
        }
      `,
    })
    return {}
  } catch (e) {
    redirect(context, '/signin')
  }
}
