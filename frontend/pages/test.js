import React from 'react'
import { Button } from 'semantic-ui-react'
import Link from 'next/link'
import { checkLoggedinUser } from '../lib/checkLoggedinUser'
import Layout from '../components/global/Layout'

function Test(props) {
  return (
    <Layout user={props.user}>
      <Link href="/">
        <Button primary>index</Button>
      </Link>
    </Layout>
  )
}

Test.getInitialProps = checkLoggedinUser
export default Test
