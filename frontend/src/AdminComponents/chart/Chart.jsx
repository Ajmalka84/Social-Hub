import "./chart.css";
import {
  // LineChart,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ title, data, dataKey, grid }) {
  return (
    <div className="chart" >
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <Bar type="monotone" dataKey={dataKey} stroke="#b50606"/>
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
