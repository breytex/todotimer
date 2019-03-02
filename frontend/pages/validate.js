import React, { useState, useContext } from 'react'
import gql from 'graphql-tag'
import { Input, Icon, Button } from 'semantic-ui-react'
import { useMutation } from '../hooks/useMutation'
import redirect from '../lib/redirect'
import { UserContext } from '../contexts/user'
import Layout from '../components/global/Layout';

const SIGNIN = gql `
  mutation Signin($token: String!) {
    signIn(token: $token) {
      email
      id
    }
  }
`

function Validate() {
  const [token, setToken] = useState('')
  const [signIn, { error, data, loading, called }] = useMutation(SIGNIN)
  const user = useContext(UserContext)

  console.log(data)
  if (data !== null) {
    console.log('success')
    user.setUser(data.signIn)
    redirect({}, '/')
  }
  if (loading) {
    return <h1>Loading</h1>
  } else if (error) {
    return <h1>Error</h1>
  } else {
    return (
      <Layout>
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
      </Layout>
    )
  }
}

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