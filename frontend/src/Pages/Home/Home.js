import React, { useContext, useState } from 'react'
import './Home.css'

import Feeds from '../../Components/Feeds/Feeds'
import Rightbar from '../../Components/Rightbar/Rightbar'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Topbar from '../../Components/Topbar/Topbar'
import { AuthContext } from '../../context/AuthContext'

function Home() {
  const {DP , setDP} = useContext(AuthContext)
  const [profilePicture , setProfilePicture] = useState()
  return (
    <div className='totalContainer'>
      {/* <Topbar profilePicture={profilePicture} setProfilePicture={setProfilePicture}/> */}
      <Topbar profilePicture={DP} setProfilePicture={setDP}/>
      <div className="homeContainer">
        <Sidebar />
        {/* <Feeds profilePicture={profilePicture} setProfilePicture={setProfilePicture}/> */}
        <Feeds profilePicture={DP} setProfilePicture={setDP}/>
        <Rightbar />
      </div>
    </div>
  )
}

export default Home
