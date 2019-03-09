import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import { useDelayImmediately } from '../../hooks/useDelay'

export default function DelayedLoader({ delay = 300 }) {
  const show = useDelayImmediately(delay)
  return (
    <React.Fragment>
      {show && (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )}
    </React.Fragment>
  )
}
