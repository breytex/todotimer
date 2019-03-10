import React, { useContext } from 'react'
import gql from 'graphql-tag'
import { Icon, Header, Message } from 'semantic-ui-react'
import Link from 'next/link'
import { useMutation } from '../../hooks/useMutation'
import redirect, { redirectHandler } from '../../lib/redirect'
import { UserContext } from '../../contexts/user'
import Layout from '../../components/global/Layout'
import Card from '../../components/global/Card'
import CodeInput from '../../components/semantic/CodeInput'
import DelayedLoader from '../../components/semantic/DelayedLoader'
import { useDelay } from '../../hooks/useDelay'

const SIGNIN = gql`
  mutation Signin($token: String!) {
    signIn(token: $token) {
      email
      id
    }
  }
`

function Validate() {
  const [signIn, { error, loading, data }] = useMutation(SIGNIN)
  const { startDelay } = useDelay()
  const user = useContext(UserContext)

  const onFilled = token =>
    signIn({ variables: { token } }).then(res => {
      if (!res || !res.data) return
      user.setUser(res.data.signIn)
      startDelay(2000).then(redirectHandler('/'))
    })

  return (
    <Layout>
      <Card centered>
        <Header as="h2" icon textAlign="center">
          <Icon name="sign in" />
          <Header.Content>
            Check your mail inbox
            <Header.Subheader>Click the magic link in the email, or enter the security code below.</Header.Subheader>
          </Header.Content>
        </Header>
        <CodeInput length={6} onFilled={onFilled} disabled={data !== null || loading} />
        {loading && <DelayedLoader />}
        {error && (
          <Message
            error
            icon="ban"
            header="This code seems to be wrong or expired."
            content={
              <span>
                Please correct your typo, or{' '}
                <Link href="/account">
                  <a>resend the email</a>
                </Link>
                .
              </span>
            }
          />
        )}
        {data !== null && <Message success icon="check" header="Successfuly signed in!" />}
      </Card>
    </Layout>
  )
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
      redirect(context, '/account')
    }
  }
}

export default Validate