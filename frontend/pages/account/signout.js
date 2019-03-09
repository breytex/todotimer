import React from 'react'
import { Header, Icon, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import Layout from '../../components/global/Layout'
import { redirectHandler } from '../../lib/redirect'

const SIGNOUT = gql`
  mutation {
    logout
  }
`

export default function Signout() {
  return (
    <Layout style={{ textAlign: 'center' }}>
      <Header as="h2" icon textAlign="center">
        <Icon name="sign out" />
        <Header.Content>
          Successfully signed out
          <Header.Subheader>See you soon!</Header.Subheader>
        </Header.Content>
      </Header>
      <Button primary className="centered" onClick={redirectHandler('/account')}>
        Sign in again
      </Button>
    </Layout>
  )
}

Signout.getInitialProps = async context => {
  try {
    await context.apolloClient.mutate({
      mutation: SIGNOUT,
    })
  } catch (e) {
    console.error(e)
  }
  return {}
}
