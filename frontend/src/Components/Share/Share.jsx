import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AxiosWithAuth from "../../Axios/Axios";

function Share({ setPosts}) {
  const { user } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState(null);

  const axiosJWT = AxiosWithAuth();
  const handleFile = (e) => {
    const imgFile = e.target.files[0];
    setImg(imgFile);
  };
  const submitPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("img", img);
    formData.append("desc", desc);
    formData.append("userId", user._doc._id);
    console.log(formData);
    await axiosJWT
      .post("post/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(async (result) => {
        await axiosJWT.get("post/all-posts")
          .then((allposts) => {
            console.log(allposts.data);
            setPosts([...allposts.data]);
          })
          .catch((error) => {
            console.log(error);
          });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return ( 
    <div className="share">
      <form onSubmit={submitPost} className="shareWrapper">
        <div className="shareTop">
          <img
            src="/assets/NoPhoto.jpg"
            alt="profileimg"
            className="shareProfileImg"
          />
          <input
            placeholder="What is in your mind ?"
            className="shareInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <hr className="shareHr" />
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <label
                htmlFor="fileInput"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <PermMediaIcon htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo or Video</span>
              </label>
              <input
                id="fileInput"
                type="file"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </div>
            <div className="shareOption">
              <LabelIcon htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <RoomIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </div>
      </form>
    </div>
  );
}

export default Share;