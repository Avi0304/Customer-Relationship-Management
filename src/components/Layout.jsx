import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import TopNav from '../TopNav/TopNav'
import { Outlet } from 'react-router-dom'
const Layout = () => {
  return (
    <div className='flex'>
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <TopNav/>
        <main className='p-6'>
            <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default Layout