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
      inputRef[length - 1].focus()
      return
    }
    inputRef[pos].focus()
  })

  const onChange = index => event => {
    if (disabled) return

    let value = event.target.value
    if (value === '') {
      input[index] = ''
    } else {
      if (uppercase) {
        value = value.toUpperCase()
      }
      for (let i = 0; i < value.length; i++) {
        if (index + i > length) break
        let char = value[i]
        if (allowedChars.includes(char)) {
          input[index + i] = char
        }
      }
    }

    const nextPos = input.findIndex(e => e === '')
    if (nextPos === -1) {
      onFilled(input.join(''))
    }
    setPos(nextPos)
    setInput(input)
  }

  const onKeyUp = index => event => {
    if (event.keyCode === 8) {
      // backspace behaviour
      if (index === 0) return
      if (input[index] === '') {
        // current focused input field already empty
        // -> empty previous
        input[index - 1] = ''
        setPos(index - 1)
        setInput(input)
      }
    }
  }

  return (
    <div style={wrapperStyle} className="semantic-code-input">
      {initialValues.map((_, index) => (
        <Input key={index} type={type} disabled={disabled}>
          <input ref={handleRef(index)} onKeyDown={onKeyUp(index)} onChange={onChange(index)} value={input[index]} />
        </Input>
      ))}
    </div>
  )
}