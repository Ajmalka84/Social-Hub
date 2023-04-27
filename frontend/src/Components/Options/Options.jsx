import React from "react";
import "./Options.css";
import AxiosWithAuth from "../../Axios/Axios";
import { Toaster, toast } from "react-hot-toast";
// import RssFeedIcon from '@mui/icons-material/RssFeed';
function Options({ post, setPosts }) {
  const axiosJWT = AxiosWithAuth();
  const deletePost = async () => {
    await axiosJWT
      .delete(`http://localhost:8000/post/${post._id}/delete`, {
        data: { userId: post.userId },
      })
      .then(async (result) => {
        await axiosJWT
          .get("http://localhost:8000/post/all-posts")
          .then((allposts) => {
            setPosts([...allposts.data]);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const reportPost = async () => {
    await axiosJWT
      .put(`post/${post._id}/report`)
      .then((result) => {
        console.log(result.data);
        toast.success("post reported");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="options">
      <div className="optionsWrapper">
        <ul className="optionsList">
          <li className="optionsListItem">
            {/* <RssFeedIcon className='optionsIcon' /> */}
            <span className="optionsListItemText">Edit</span>
          </li>
          <li className="optionsListItem">
            {/* <RssFeedIcon className='optionsIcon' /> */}
            <span className="optionsListItemText" onClick={deletePost}>
              Delete
            </span>
          </li>
          <li className="optionsListItem">
            {/* <RssFeedIcon className='optionsIcon' /> */}
            <span className="optionsListItemText" onClick={reportPost}>
              Report
            </span>
          </li>
        </ul>
        {/* <button className="optionsButton">
            Show More
          </button> */}
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
    </div>
  );
}

export default Options;
