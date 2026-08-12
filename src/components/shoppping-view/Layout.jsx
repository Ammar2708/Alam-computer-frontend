import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import StoreAssistant from './StoreAssistant'

const Layout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header openCartSheet={isCartOpen} setOpenCartSheet={setIsCartOpen}/>
      <Outlet/>
      <Footer/>
      {!isCartOpen && <StoreAssistant/>}
    </div>
  )
}

export default Layout
