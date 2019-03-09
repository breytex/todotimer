import { useState, useEffect } from 'react'

export const useDelay = () => {
  const [state, setState] = useState(false)

  let timeout = null
  useEffect(() => () => {
    if (timeout === null) return
    clearTimeout(timeout)
  })

  const startDelay = delay =>
    new Promise(resolve => {
      timeout = setTimeout(() => {
        setState(true)
        resolve()
      }, delay)
    })

  return { state, startDelay }
}

export const useDelayImmediately = delay => {
  const { state, startDelay } = useDelay()
  startDelay(delay)
  return state
}
