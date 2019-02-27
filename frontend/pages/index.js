import React from 'react'
import { Button } from 'semantic-ui-react'
import Secure from '../components/global/Secure'
import { checkLoggedinUser } from '../lib/checkLoggedinUser'

function Home() {
  return (
    <Secure>
      <Button primary>test</Button>
    </Secure>
  )
}

Home.getInitialProps = checkLoggedinUser
export default Home
