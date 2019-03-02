import React, { useState } from 'react'

export const UserContext = React.createContext()

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ email: null, id: null })
  const contextUser = { ...user, setUser }

  return <UserContext.Provider value={contextUser}>{children}</UserContext.Provider>
}
