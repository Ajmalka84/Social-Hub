import React from 'react'
import './Options.css'
import AxiosWithAuth from '../../Axios/Axios'

// import RssFeedIcon from '@mui/icons-material/RssFeed';
function Options({post , setPosts}) {
  const axiosJWT = AxiosWithAuth()
  const deletePost = async()=> {
    await axiosJWT.delete(`http://localhost:8000/post/${post._id}/delete` , {data : {userId : post.userId}}).then(async(result) =>{
      await axiosJWT
      .get("http://localhost:8000/post/all-posts"
      )
      .then((allposts) => {
        console.log(allposts.data);
        setPosts([...allposts.data]);
      })
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
  }
  return (
    <div className='options'>
       <div className="optionsWrapper">
          <ul className="optionsList">
              <li className="optionsListItem">
                {/* <RssFeedIcon className='optionsIcon' /> */}
                <span className="optionsListItemText" >Edit</span>
              </li>
              <li className="optionsListItem">
                {/* <RssFeedIcon className='optionsIcon' /> */}
                <span className="optionsListItemText"onClick={deletePost}>Delete</span>
              </li>
          </ul>
          {/* <button className="optionsButton">
            Show More
          </button> */}
       </div>      
    </div>
  )
}

export default Options