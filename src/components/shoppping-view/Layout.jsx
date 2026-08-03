import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import StoreAssistant from './StoreAssistant'

const Layout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header/>
      <Outlet/>
      <Footer/>
      <StoreAssistant/>
    </div>
  )
}

export default Layout
