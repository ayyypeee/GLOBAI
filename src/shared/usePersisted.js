import { useCallback, useState } from 'react'

export function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initial : JSON.parse(saved)
    } catch {
      return initial
    }
  })

  const update = useCallback(
    (next) => {
      setValue(next)
      try {
        if (next === null) localStorage.removeItem(key)
        else localStorage.setItem(key, JSON.stringify(next))
      } catch {
        return
      }
    },
    [key],
  )

  return [value, update]
}