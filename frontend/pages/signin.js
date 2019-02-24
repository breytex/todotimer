import React, { useState } from 'react'
import { InputGroup, Button, Callout, Spinner } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { useMutation } from '../hooks/useMutation'
import redirect from '../lib/redirect'

const REQUEST_SIGNIN = gql `
  mutation RequestSignin($user: UserInput!) {
    requestSignIn(user: $user)
  }
`

const SIGNIN = gql `
  mutation Signin($token: String!) {
    signIn(token: $token)
  }
`

function Signin({ query, res }) {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [sentToken, setSentToken] = useState(false)
  const [requestSignin, { error: requestSigninError, data: requestSigninData }] = useMutation(REQUEST_SIGNIN)
  const [signIn, { error: signinError, data: signinData, loading: signinLoading, called }] = useMutation(SIGNIN)

  if (sentToken || query.token) {
    const finalToken = query.token ? query.token : token
    if (!called) signIn({ variables: { token: finalToken } })
    if (signinLoading) {
      return <Spinner size={65} />
    } else {
      if (!signinError) {
        redirect({ res }, '/')
      } else {
        return <h1>error</h1>
      }
    }
  } else if (requestSigninData && requestSigninData.requestSignIn) {
    return (
      <div>
        <InputGroup
          large={true}
          leftIcon="filter"
          onChange={e => {
            setToken(e.target.value)
          }}
          placeholder="Enter login token..."
          value={token}
        />
        <Button
          onClick={() => {
            setSentToken(true)
          }}
        >
          Login
        </Button>
      </div>
    )
  } else {
    return (
      <div>
        {requestSigninError !== null && <Callout intent="danger">Please enter a valid email address!</Callout>}
        <InputGroup
          large={true}
          leftIcon="filter"
          onChange={e => {
            setEmail(e.target.value)
          }}
          placeholder="Filter histogram..."
          value={email}
        />
        <Button
          onClick={() => {
            requestSignin({
              variables: { user: { email } },
            })
          }}
        >
          Login / SignUp
        </Button>
      </div>
    )
  }
}

Signin.getInitialProps = ({ query, res }) => {
  return { query, res }
}

export default Signin