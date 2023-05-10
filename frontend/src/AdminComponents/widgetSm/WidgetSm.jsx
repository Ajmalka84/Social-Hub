import "./widgetSm.css";
// import { Visibility } from "@material-ui/icons";

export default function WidgetSm({ dashBoard }) {
  console.log(dashBoard);
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {dashBoard?.lastFiveUsers.map((users) => {
          return (
            <li className="widgetSmListItem">
              {/* <img
            src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=2&w=500"
            alt=""
            className="widgetSmImg"
          /> */}
              <div className="widgetSmUser">
                <span className="widgetSmUsername">{users.username}</span>
                <span className="widgetSmUserTitle">{users.email}</span>
              </div>
              <button className="widgetSmButton">
                {/* <Visibility className="widgetSmIcon" /> */}
                {!users.blocked ? "Active" : "inActive"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
