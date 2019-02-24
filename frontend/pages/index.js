import React from 'react'
import { Button } from '@blueprintjs/core'
import Secure from '../components/global/Secure'
import { checkLoggedinUser } from '../lib/checkLoggedinUser'

function Home() {
  return (
    <Secure>
      <Button intent="danger" icon="refresh">
        test
      </Button>
    </Secure>
  )
}

Home.getInitialProps = checkLoggedinUser
export default Home
