import React, { useContext, useEffect, useState } from "react";
import "./NotificationList.css";
import AxiosWithAuth from "../../Axios/Axios";
import { AuthContext } from "../../context/AuthContext";
import jwtDecode from "jwt-decode";
import { format } from "timeago.js";
function NotificationList() {
  const axiosJwt = AxiosWithAuth();
  const [notification, setNotification] = useState();
  const { Auth } = useContext(AuthContext);
  const decodedAuth = jwtDecode(Auth.accessToken);
  useEffect(() => {
    const getNotifications = async () => {
      await axiosJwt
        .get(`users/${decodedAuth._id}/get-notifications`)
        .then((result) => {
          setNotification([...result.data]);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getNotifications();
  }, []);

  const markUnread = async(notificationId)=>{
    console.log(notificationId)
    await axiosJwt.get(`users/${notificationId}/read`).then((result)=>{
      console.log(result.data)
    }).catch((error)=>{
      console.log(error)
    })
  }
  return (
    <div className="notification">
      <div className="notificationWrapper">
        <ul className="notificationList">
          {!notification
            ? ''
            : notification.map((n) => {
                return (
                <li className="notificationListItem" onClick={()=>markUnread(n._id)}>
                  <div className="notificationListItemDiv">
                    <div className="notificationListItemDivLeft">
                      <span className="notificationListItemText">
                        <b>{n.text}</b>
                      </span>
                    </div>
                    <div className="notificationListItemDivRight">
                      <span className="notificationListItemText" style={{fontSize : "10px"}}>{format(n.createdAt)}</span><span className="notificationListItemText" style={{fontSize : "10px" , marginLeft : "40px"}}>
                        {n.status}
                      </span>
                    </div>
                  </div>
                </li>)
              })}
        </ul>
        {/* <button className="notificationButton">Show More</button> */}
      </div>
    </div>
  );
}

export default NotificationList;
