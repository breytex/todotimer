import React from 'react'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'
import redirect from '../../lib/redirect'

export default function Navbar(props) {
  const { user } = props
  return (
    <Menu text size="huge" style={{ padding: '0em 2em' }}>
      {user && (
        <Menu.Item onClick={props.onSidebarButtonClicked}>
          <Icon name="bars" />
        </Menu.Item>
      )}

      <Menu.Item header>LitTodo</Menu.Item>

      {user && (
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