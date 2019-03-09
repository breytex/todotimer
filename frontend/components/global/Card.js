import React from 'react'
import { Card as SemanticCard } from 'semantic-ui-react'

export default function Card({ children, centered, style }) {
  let styles
  if (centered) {
    styles = {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '500px',
      margin: '0 auto',
    }
  } else {
    styles = {}
  }
  return (
    <SemanticCard fluid centered={centered}>
      <SemanticCard.Content style={style}>
        <div style={styles}>{children}</div>
      </SemanticCard.Content>
    </SemanticCard>
  )
}
