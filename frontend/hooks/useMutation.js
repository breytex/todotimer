import { useState } from 'react'
import { useMutation as useHookMutation } from 'react-apollo-hooks'

// by zebapy: https://github.com/trojanowski/react-apollo-hooks/issues/20
export function useMutation(mutation, { onCompleted, onError, ...options } = {}) {
  const [loading, setLoading] = useState(false)
  const [called, setCalled] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const mutate = useHookMutation(mutation, options)

  const handler = async (...args) => {
    setLoading(true)
    setCalled(true)
    setError(null)
    setData(null)

    try {
      const { data } = await mutate(...args)
      console.log('done')
      console.log(data)
      setData(data)

      setLoading(false)

      if (onCompleted) {
        onCompleted(data)
      }

      return { data }
    } catch (e) {
      setLoading(false)
      setError(e)

      if (onError) {
        onError(e)
      }
    }
  }

  return [
    handler,
    {
      loading,
      called,
      error,
      data,
    },
  ]
}