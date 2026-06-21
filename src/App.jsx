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
import Circulars  from './pages/Circulars'
import Gallery    from './pages/Gallery'
import Contact     from './pages/Contact'
import Articles    from './pages/Articles'
import ArticlePage from './pages/ArticlePage'

import PrivateRoute from './components/PrivateRoute'
import AdminLogin  from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard   from './pages/admin/Dashboard'
import Members from './pages/admin/Members'
import Inquiries from './pages/admin/Inquiries'
import AdminCirculars from './pages/admin/Circulars'
import AdminGallery from './pages/admin/Gallery'
import AdminArticles from './pages/admin/Articles'
import AdminPlans from './pages/admin/Plans'
import AdminAdmins from './pages/admin/Admins'



function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [pathname])
  return null
}

// Public site layout — with Navbar, Footer, A11yBar
function PublicLayout() {
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
          <Route path="/circulars"  element={<Circulars />} />
          <Route path="/gallery"    element={<Gallery />} />
          <Route path="/contact"        element={<Contact />} />
          <Route path="/articles"       element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const { textSize, contrast, motion } = useA11y()
  const { pathname } = useLocation()

  const isAdmin = pathname.startsWith('/admin')

  return isAdmin ? (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="circulars" element={<AdminCirculars />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="plans"    element={<AdminPlans />} />
        <Route path="admins"   element={<AdminAdmins />} />
      </Route>
    </Routes>
  ) : (
    <PublicLayout />
  )
}