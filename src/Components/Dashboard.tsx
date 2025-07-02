import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Dashboard.css";

type BookingItem = {
  month: string;
  bookings: number;
  color: string;
};

function Dashboard() {
  const [bookingData, setBookingData] = useState<BookingItem[]>([]);
  const [today, setToday] = useState({ bookings: 0, hours: 0 });
  const [upcoming, setUpcoming] = useState({ bookings: 0, hours: 0 });
  const [past, setPast] = useState({ bookings: 0, hours: 0 });

  const [filter, setFilter] = useState<"Month" | "Year">("Year");
  const [currentDate, setCurrentDate] = useState(dayjs());

  // ✅ Total values from API
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  const isNextMonthDisabled =
    filter === "Month" && currentDate.isSame(dayjs(), "month");
  const isNextYearDisabled =
    filter === "Year" && currentDate.isSame(dayjs(), "year");

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        let url = "";

        if (filter === "Year") {
          const year = currentDate.year();
          url = `http://localhost:5125/api/AdminDashboard/year?year=${year}`;
        } else {
          const month = currentDate.month() + 1;
          const year = currentDate.year();
          url = `http://localhost:5125/api/AdminDashboard/month?month=${month}&year=${year}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // ✅ Set total from API
        setTotalBookings(data.totalBookings || 0);
        setTotalHours(data.totalHours || 0);

        const graphData =
          filter === "Year"
            ? data.data.map((item: any) => ({
                month: item.label,
                bookings: item.bookings,
                color: item.color,
              }))
            : data.data.map((item: any) => ({
                month: `Day ${item.day}`,
                bookings: item.bookings,
                color: "#007bff",
              }));

        setBookingData(graphData);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    const fetchSummaryData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5125/api/AdminDashboard/summary"
        );
        const data = await res.json();

        setToday({ bookings: data.today, hours: data.todayHours });
        setUpcoming({ bookings: data.upcoming, hours: data.upcomingHours });
        setPast({ bookings: data.past, hours: data.pastHours });
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    fetchGraphData();
    fetchSummaryData(); // You can remove this if summary cards are not required
  }, [filter, currentDate]);

  return (
    <div className="dashboard-wrapper">
      <button className="back">Dashboard</button>

      <div className="filter-bar">
        <div className="navigator">
          <ChevronLeft
            className="nav-icon"
            onClick={() =>
              setCurrentDate((prev) =>
                filter === "Month"
                  ? prev.subtract(1, "month")
                  : prev.subtract(1, "year")
              )
            }
          />
          <span className="date-display">
            {filter === "Month"
              ? currentDate.format("MMM YYYY").toUpperCase()
              : currentDate.format("YYYY")}
          </span>
          <ChevronRight
            className="nav-icon"
            onClick={() => {
              if (filter === "Month" && !isNextMonthDisabled) {
                setCurrentDate((prev) => prev.add(1, "month"));
              } else if (filter === "Year" && !isNextYearDisabled) {
                setCurrentDate((prev) => prev.add(1, "year"));
              }
            }}
            style={{
              opacity:
                (filter === "Month" && isNextMonthDisabled) ||
                (filter === "Year" && isNextYearDisabled)
                  ? 0.3
                  : 1,
              pointerEvents:
                (filter === "Month" && isNextMonthDisabled) ||
                (filter === "Year" && isNextYearDisabled)
                  ? "none"
                  : "auto",
            }}
          />
        </div>

        <div className="dropdown-container">
          <label>Filter By</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "Month" | "Year")}
            className="filter-select"
          >
            <option value="Month">Month</option>
            <option value="Year">Year</option>
          </select>
        </div>
      </div>

      {/* ✅ Filter-based total summary */}
      <div className="total-info">
        <strong>{totalHours} Hr</strong>
        <strong>{totalBookings} Bookings</strong>
      </div>

      <div className="dashboard-container">
        <div className="graph-content">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                }}
                formatter={(value) => [`${value} bookings`, "Bookings"]}
              />
              <Line
                type="linear"
                dataKey="bookings"
                stroke="#000"
                strokeWidth={2}
                dot={({ cx, cy, payload }) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    stroke="#000"
                    strokeWidth={1}
                    fill={payload.color}
                  />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <span>Today</span>
            <span>
              Bookings: {today.bookings} &nbsp; Hours: {today.hours}
            </span>
          </div>
          <div className="summary-card">
            <span>Upcoming</span>
            <span>
              Bookings: {upcoming.bookings} &nbsp; Hours: {upcoming.hours}
            </span>
          </div>
          <div className="summary-card">
            <span>Past</span>
            <span>
              Bookings: {past.bookings} &nbsp; Hours: {past.hours}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
