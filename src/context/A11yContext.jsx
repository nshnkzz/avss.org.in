import { createContext, useContext, useState, useEffect } from 'react'

const A11yContext = createContext()

export function A11yProvider({ children }) {
  const [textSize, setTextSizeState] = useState(
    () => localStorage.getItem('avss-size') || 'normal'
  )
  const [contrast, setContrastState] = useState(
    () => localStorage.getItem('avss-contrast') === 'true'
  )
  // motion: true = animations ON (default), false = reduce motion
  const [motion, setMotionState] = useState(
    () => localStorage.getItem('avss-motion') !== 'false'
  )
  const [darkMode, setDarkModeState] = useState(
    () => localStorage.getItem('avss-dark') === 'true'
  )

  const setTextSize = (s) => {
    setTextSizeState(s)
    localStorage.setItem('avss-size', s)
  }
  const setContrast = (v) => {
    setContrastState(v)
    localStorage.setItem('avss-contrast', v)
  }
  const setMotion = (v) => {
    setMotionState(v)
    localStorage.setItem('avss-motion', v)
  }
  const setDarkMode = (v) => {
    setDarkModeState(v)
    localStorage.setItem('avss-dark', v)
  }

  // Apply classes to <html>
  useEffect(() => {
    const el = document.documentElement
    el.classList.remove('a11y-large', 'a11y-xlarge')
    if (textSize === 'large')  el.classList.add('a11y-large')
    if (textSize === 'xlarge') el.classList.add('a11y-xlarge')
  }, [textSize])

  useEffect(() => {
    document.documentElement.classList.toggle('a11y-contrast', contrast)
  }, [contrast])

  useEffect(() => {
    // no-motion class when motion is OFF
    document.documentElement.classList.toggle('a11y-no-motion', !motion)
  }, [motion])

  useEffect(() => {
    document.documentElement.classList.toggle('a11y-dark', darkMode)
  }, [darkMode])

  return (
    <A11yContext.Provider value={{ textSize, setTextSize, contrast, setContrast, motion, setMotion, darkMode, setDarkMode }}>
      {children}
    </A11yContext.Provider>
  )
}

export const useA11y = () => useContext(A11yContext)
