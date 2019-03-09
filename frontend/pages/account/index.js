import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Input, Icon, Button, Header } from 'semantic-ui-react'
import { useMutation } from '../../hooks/useMutation'
import redirect from '../../lib/redirect'
import Layout from '../../components/global/Layout'
import Card from '../../components/global/Card'

const REQUEST_SIGNIN = gql`
  mutation RequestSignin($user: UserInput!) {
    requestSignIn(user: $user)
  }
`

function Signin() {
  const [email, setEmail] = useState('')
  const [requestSignin, { error, data }] = useMutation(REQUEST_SIGNIN)

  if (data !== null) {
    redirect({}, '/account/validate')
  }

  return (
    <Layout>
      <Card centered>
        <Header as="h2" icon textAlign="center">
          <Icon name="sign in" />
          <Header.Content>
            Sign in or create an account
            <Header.Subheader>{"It's"} free!</Header.Subheader>
          </Header.Content>
        </Header>
        {error !== null && <h1>Please enter a valid email address!</h1>}
        <Input
          style={{ margin: '1.5em 0em' }}
          size="big"
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
        <Button.Group size="large">
          <Button
            primary
            onClick={() => {
              requestSignin({
                variables: { user: { email } },
              })
            }}
          >
            Sign In
          </Button>
          <Button.Or />
          <Button
            onClick={() => {
              requestSignin({
                variables: { user: { email } },
              })
            }}
          >
            Create an account
          </Button>
        </Button.Group>
      </Card>
    </Layout>
  )
}

export default Signin
