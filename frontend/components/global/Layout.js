import React, { useState, useContext } from 'react'
import { Sidebar, Menu, Icon, Segment } from 'semantic-ui-react'
import { UserContext } from '../../contexts/user'
import Navbar from './Navbar'

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
        <Navbar user={props.user} onSidebarButtonClicked={() => setSidebar(!sidebarVisible)} />

        <Wrapper {...props}>{props.children}</Wrapper>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

function LoggedOutLayout(props) {
  return (
    <React.Fragment>
      <Navbar />
      <Wrapper {...props}>{props.children}</Wrapper>
    </React.Fragment>
  )
}

function Wrapper(props) {
  return (
    <div className="container" style={props.style}>
      {props.children}
    </div>
  )
}

export default function Layout(props) {
  const user = useContext(UserContext)
  if (typeof props.user !== 'undefined') {
    user.setUser(props.user)
  }

  if (user.email) {
    return <LoggedInLayout {...props} user={user} />
  } else {
    return <LoggedOutLayout {...props} user={{ email: null, id: null }} />
  }
}
