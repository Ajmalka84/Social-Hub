import Chart from "../../AdminComponents/chart/Chart";
import FeaturedInfo from "../../AdminComponents/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData"; 
import WidgetSm from "../../AdminComponents/widgetSm/WidgetSm";
import WidgetLg from "../../AdminComponents/widgetLg/WidgetLg";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import AxiosAdminJwt from "../../Axios/AxiosAdmin";

export default function AdminHome() {
  const axiosAdmin = AxiosAdminJwt()
  const {AdminAuth} = useContext(AuthContext)
  const [dashBoard, setDashBoard] = useState()
  
  const token = localStorage.getItem('AdminAccessToken');
  console.log(token)
  useEffect(()=>{
    const Data = async () =>{
       const result = await axiosAdmin.get('all-details')
       console.log(result)
       setDashBoard(result.data)
    }
    Data()
  },[])
  userData.map((u)=>{
    dashBoard?.graphDetails.find((d)=> {
     if(d._id === u.id){
      u["Active User"] = d.count
     }
    })
  })

  console.log(userData)
  return (
    <div className="home">
      <FeaturedInfo dashBoard={dashBoard}/>
      <Chart data={userData} title="User Analytics" grid dataKey="Active User"/>
      <div className="homeWidgets">
        <WidgetSm dashBoard={dashBoard}/>
      </div>
    </div>
  );
}
