import React from 'react'
import './Home.css'

import Feeds from '../../Components/Feeds/Feeds'
import Rightbar from '../../Components/Rightbar/Rightbar'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Topbar from '../../Components/Topbar/Topbar'

function Home() {
  
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feeds />
        <Rightbar />
      </div>
    </>
  )
}

export default Home
