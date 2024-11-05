import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EventData {
  date: string;
  clicks: number;
  reservations: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<EventData[]>([]);

  useEffect(() => {
    // Fetch data from your API or database
    const fetchData = async () => {
      // Replace with your data fetching logic
      const response = await fetch("/api/events");
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Event Clicks and Ticket Reservations</h2>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="reservations" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
