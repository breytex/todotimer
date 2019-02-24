import React from 'react'
import { Button } from '@blueprintjs/core'
import Layout from '../components/global/Layout'

function Home() {
  return (
    <Layout>
      <Button intent="danger" icon="refresh">
        test
      </Button>
    </Layout>
  )
}

export default Home
