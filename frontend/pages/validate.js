import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Input, Icon, Button } from 'semantic-ui-react'
import { ApolloClient } from 'apollo-client'
import { useMutation } from '../hooks/useMutation'
import redirect from '../lib/redirect'

const SIGNIN = gql`
  mutation Signin($token: String!) {
    signIn(token: $token)
  }
`

function Validate({ onTokenSent }) {
  const [token, setToken] = useState('')
  const [signIn, { error, data, loading, called }] = useMutation(SIGNIN)
  if (data !== null) {
    console.log('success')
    redirect({}, '/')
  }
  if (loading) {
    return <h1>Loading</h1>
  } else if (error) {
    return <h1>Error</h1>
  } else {
    return (
      <React.Fragment>
        <Input
          iconPosition="left"
          placeholder="Email"
          value={token}
          onChange={e => {
            setToken(e.target.value)
          }}
        >
          <Icon name="at" /> <input />
        </Input>
        <Button onClick={() => signIn({ variables: { token } })}> Login </Button>
      </React.Fragment>
    )
  }
}

// function VerifyToken(token, res) {

//   signIn({ variables: { token } })

//   if (data) {
//     redirect({}, '/')
//   } else if (loading) {
//     return <h1>Loading</h1>
//   } else {
//     return <h1>error</h1>
//   }
// }

Validate.getInitialProps = async context => {
  if (context.query.token) {
    try {
      await context.apolloClient.mutate({
        mutation: SIGNIN,
        variables: { token: context.query.token },
      })
      redirect(context, '/')
    } catch (e) {
      redirect(context, '/signin')
    }
  }
}

export default Validate
