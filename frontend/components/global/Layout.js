import React, { useState, useContext } from 'react'
import { Card, Sidebar, Menu, Icon, Button, Segment } from 'semantic-ui-react'
import { UserContext, UserContextProvider } from '../../contexts/user'

function LoggedInLayout(props) {
  const [sidebarVisible, setSidebar] = useState(false)

  return (
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

        <CardLayout>{props.children}</CardLayout>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

function CardLayout(props) {
  return (
    <div className="container">
      <Card fluid>
        <Card.Content>{props.children}</Card.Content>
      </Card>
    </div>
  )
}

export default function Layout(props) {
  const user = useContext(UserContext)
  if (props.user) {
    user.setUser(props.user)
  }

  if (user.email) {
    return <LoggedInLayout {...props} />
  } else {
    return <CardLayout {...props} />
  }
}
