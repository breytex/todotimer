import React from 'react'
import { Button } from 'semantic-ui-react'
import Link from 'next/link'
import { checkLoggedinUser } from '../lib/checkLoggedinUser'
import Layout from '../components/global/Layout'

function Home(props) {
  return (
    <Layout user={props.user}>
      <Link href="/test">
        <Button primary>test</Button>
      </Link>
    </Layout>
  )
}

Home.getInitialProps = checkLoggedinUser
export default Home
