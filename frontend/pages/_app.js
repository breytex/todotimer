import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'
import 'normalize.css'
import '../global.scss'
import '../src/css/semantic/semantic.min.css'

import { ApolloProvider } from 'react-apollo-hooks'
import withApollo from '../lib/withApollo'

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps, apollo } = this.props

    return (
      <Container>
        <Head>
          <title>LitTodo</title>
        </Head>
        <ApolloProvider client={apollo}>
          <Component {...pageProps} apolloClient={apollo} />
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApollo(MyApp)
