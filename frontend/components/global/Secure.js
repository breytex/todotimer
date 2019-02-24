import React from 'react'

import Layout from './Layout'

function Secure(props) {
  console.log(props)
  return (
    <Layout>
      {props.children} {props.loggedinUser}
    </Layout>
  )
}

export default Secure
