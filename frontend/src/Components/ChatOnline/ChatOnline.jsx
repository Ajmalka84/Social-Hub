import React from 'react'
import './ChatOnline.css'

function ChatOnline() {
  return (
    <div className='chatOnline'>
        <div className="chatOnlineFriend">
             <div className="chatOnlineImgContainer">
                <img src="/assets/NoPhoto.jpg" alt=""  className='chatOnlineImg'/>
                <div className="chatOnlineBadge">
                     
                </div>
             </div>
             <span className="chatOnlineName">John doe</span>
        </div>
    </div>
  )
}

export default ChatOnline