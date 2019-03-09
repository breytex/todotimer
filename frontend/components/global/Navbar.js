import React, { useContext } from 'react'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'
import { UserContext } from '../../contexts/user'
import redirect from '../../lib/redirect'

export default function Navbar(props) {
  const user = useContext(UserContext)

  return (
    <Menu text size="huge" style={{ padding: '0em 2em' }}>
      {!user.email && (
        <Menu.Item onClick={props.onSidebarButtonClicked}>
          <Icon name="bars" style={{ opacity: user.email ? '1' : '0' }} />
        </Menu.Item>
      )}

      <Menu.Item header>LitTodo</Menu.Item>

      {user.email && (
        <Menu.Menu position="right">
          <Dropdown
            item
            trigger={
              <React.Fragment>
                <Icon name="user" /> {user.email}
              </React.Fragment>
            }
          >
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  redirect({}, '/account/signout')
                }}
              >
                <Icon name="sign out" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      )}
    </Menu>
  )
}
