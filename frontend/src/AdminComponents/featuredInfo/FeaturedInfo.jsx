import "./featuredInfo.css";
// import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

export default function FeaturedInfo({dashBoard}) {
  
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Users</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">Active : {dashBoard?.activeUsers} <span style={{marginLeft : "20px"}}>Blocked : {dashBoard?.blockedUsers}</span></span>
        </div>
        <span className="featuredSub">Based on Full data</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Posts</span>
        <div className="featuredMoneyContainer">
        <span className="featuredMoney">Active : {dashBoard?.activePosts} <span style={{marginLeft : "20px"}}>Blocked : {dashBoard?.blockedPosts}</span></span>
          
        </div>
        <span className="featuredSub">Based on Full data</span>
      </div>
    </div>
  );
}
