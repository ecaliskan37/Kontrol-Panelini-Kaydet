import { useEffect, useState } from 'react'

const useLocalStorage = (key, defaultValue) => {
  // Create state variable to store
  // localStorage value in state

  useEffect(() => {})
  const [localStorageValue, setLocalStorageValue] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue
    }
    try {
      const value = window.localStorage.getItem(key)
      // If value is already present in
      // localStorage then return it

      // Else set default value in
      // localStorage and then return it
      if (value) {
        return JSON.parse(value)
      } else {
        window.localStorage.setItem(key, JSON.stringify(defaultValue))
        return defaultValue
      }
    } catch (error) {
      window.localStorage.setItem(key, JSON.stringify(defaultValue))
      return defaultValue
    }
  })

  // this method update our localStorage and our state
  const setLocalStorageStateValue = (valueOrFn) => {
    let newValue
    if (typeof valueOrFn === 'function') {
      const fn = valueOrFn
      newValue = fn(localStorageValue)
    } else {
      newValue = valueOrFn
    }
    window.localStorage.setItem(key, JSON.stringify(newValue))
    setLocalStorageValue(newValue)
  }
  return [localStorageValue, setLocalStorageStateValue]
}

export default useLocalStorage
