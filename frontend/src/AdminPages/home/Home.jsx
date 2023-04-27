import Chart from "../../AdminComponents/chart/Chart";
import FeaturedInfo from "../../AdminComponents/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData"; 
import WidgetSm from "../../AdminComponents/widgetSm/WidgetSm";
import WidgetLg from "../../AdminComponents/widgetLg/WidgetLg";

export default function AdminHome() {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart data={userData} title="User Analytics" grid dataKey="Active User"/>
      <div className="homeWidgets">
        <WidgetSm/>
        <WidgetLg/>
      </div>
    </div>
  );
}
