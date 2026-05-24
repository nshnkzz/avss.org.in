import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useA11y } from './context/A11yContext'

import SkipLink  from './components/layout/SkipLink'
import A11yBar   from './components/layout/A11yBar'
import Navbar    from './components/layout/Navbar'
import Footer    from './components/layout/Footer'

import Home       from './pages/Home'
import About      from './pages/About'
import Membership from './pages/Membership'
import Donate     from './pages/Donate'
import Schemes    from './pages/Schemes'
import Gallery    from './pages/Gallery'
import Contact    from './pages/Contact'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [pathname])
  return null
}

export default function App() {
  const { textSize, contrast, motion } = useA11y()

  // A11y classes on <html> are managed inside A11yContext useEffects.
  // This component just consumes them to ensure re-render.

  return (
    <>
      <SkipLink />
      <A11yBar />
      <Navbar />
      <ScrollToTop />
      <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/donate"     element={<Donate />} />
          <Route path="/schemes"    element={<Schemes />} />
          <Route path="/gallery"    element={<Gallery />} />
          <Route path="/contact"    element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
