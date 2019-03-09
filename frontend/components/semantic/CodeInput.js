import React, { useState, useEffect } from 'react'
import { Input } from 'semantic-ui-react'

// TODO: backspace on filled input field has weird behaviour

const wrapperStyle = { display: 'flex', justifyContent: 'center' }
export default function CodeInput({
  length = 4,
  type = 'text',
  disabled = false,
  uppercase = true,
  onFilled = () => {},
  allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstzvwxyzZ0123456789',
}) {
  const initialValues = Array.apply(null, { length: length }).map(() => '')
  const [pos, setPos] = useState(0)
  const [input, setInput] = useState(initialValues)

  const inputRef = []
  const handleRef = index => c => {
    inputRef[index] = c
  }

  useEffect(() => {
    if (pos >= length || pos === -1) {
      document.activeElement.blur()
      return
    }
    inputRef[pos].focus()
  })

  const onKeyUp = index => event => {
    let char = String.fromCharCode(event.keyCode)

    if (event.keyCode === 8) {
      // backspace behaviour
      if (index === 0) return
      if (input[index] === '') {
        // current focused input field already empty
        // -> empty previous
        input[index - 1] = ''
        setPos(index - 1)
      } else {
        input[index] = ''
      }
      setInput(input)
    } else if (allowedChars.includes(char)) {
      if (uppercase) {
        char = char.toUpperCase()
      }

      input[index] = char
      const nextPos = input.findIndex(e => e === '')
      if (nextPos === -1) {
        onFilled(input.join(''))
      }
      setPos(nextPos)
      setInput(input)
    }
  }

  return (
    <div style={wrapperStyle} className="semantic-code-input">
      {initialValues.map((_, index) => (
        <Input key={index} type={type} disabled={disabled}>
          <input maxLength="1" ref={handleRef(index)} onKeyDown={onKeyUp(index)} value={input[index]} />
        </Input>
      ))}
    </div>
  )
}