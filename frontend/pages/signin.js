import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Input, Icon, Button } from 'semantic-ui-react'
import { useMutation } from '../hooks/useMutation'
import redirect from '../lib/redirect'
import Layout from '../components/global/Layout'

const REQUEST_SIGNIN = gql`
  mutation RequestSignin($user: UserInput!) {
    requestSignIn(user: $user)
  }
`

function Signin() {
  const [email, setEmail] = useState('')
  const [requestSignin, { error, data }] = useMutation(REQUEST_SIGNIN)
  if (data !== null) {
    redirect({}, '/validate')
  }
  return (
    <Layout>
      {error !== null && <h1>Please enter a valid email address!</h1>}
      <Input
        iconPosition="left"
        placeholder="Email"
        value={email}
        onChange={e => {
          setEmail(e.target.value)
        }}
      >
        <Icon name="at" />
        <input />
      </Input>
      <Button
        onClick={() => {
          requestSignin({
            variables: { user: { email } },
          })
        }}
      >
        Login / SignUp
      </Button>
    </Layout>
  )
}

export default Signin
