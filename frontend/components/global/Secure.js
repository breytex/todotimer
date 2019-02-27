import React, { useState } from 'react'

import { Sidebar, Segment, Icon, Menu, Button, Card } from 'semantic-ui-react'
import Layout from './Layout'

function Secure(props) {
  const [sidebarVisible, setSidebar] = useState(false)

  return (
    <Layout>
      <Sidebar.Pushable as={Segment}>
        <Sidebar as={Menu} icon="labeled" animation="push" inverted vertical visible={sidebarVisible} width="thin">
          <Menu.Item as="a">
            <Icon name="home" />
            Home
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="gamepad" />
            Games
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="camera" />
            Channels
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
          <Button
            style={{ marginTop: '1em', marginLeft: '1em' }}
            basic
            icon="bars"
            onClick={() => setSidebar(!sidebarVisible)}
          />
          <div className="container">
            <Card fluid>
              <Card.Content>{props.children}</Card.Content>
            </Card>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Layout>
  )
}

export default Secure
