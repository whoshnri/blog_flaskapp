"use client"

import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { Eye, Heart, FileText, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
const API = import.meta.env.VITE_API_BASE_URL;


const colorGrade = (num, max) => {
  const rangeIndex = Math.min(Math.ceil((num / max) * 100), 100);

  const gradeColors = [
    "#ff4d4f",
    "#ff7a45",
    "#ffa940",
    "#ffec3d",
    "#73d13d",
    "#52c41a",
    "#13c2c2"
  ];

  if (rangeIndex >= 0 && rangeIndex <= 15) {
    return gradeColors[0];
  } else if (rangeIndex <= 30) {
    return gradeColors[1];
  } else if (rangeIndex <= 45) {
    return gradeColors[2];
  } else if (rangeIndex <= 55) {
    return gradeColors[3];
  } else if (rangeIndex <= 70) {
    return gradeColors[4];
  } else if (rangeIndex <= 85) {
    return gradeColors[5];
  } else {
    return gradeColors[6];
  }
};


function AnimatedCounter({ end, duration }) {
  const [count, setCount] = useState(0);


  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end]);

  return <span>{count.toLocaleString()}</span>;
}


export default function AnalyticsPanel({ user, userName }) {

const [currentWeek, setCurrentWeek] = useState();
const [data, setData] = useState([]);
const [today, setToday] = useState("")
const [yesterday, setYesterday] = useState("")


useEffect(() => {
  function getCurrentWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const monday = new Date(today);
    const diffToMonday = (dayOfWeek + 6) % 7;
    monday.setDate(today.getDate() - diffToMonday);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }); // "18 Jun, 2025"
    });

    return weekDates;
  }

  setCurrentWeek(getCurrentWeekDates());
}, []);

 useEffect(() => {
  console.log(user)
  const getFormattedDates = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const format = (date) =>
      date.toLocaleDateString("en-GB", {
        weekday: "short" // e.g., "Mon", "Tue"
      });

    setToday(format(today));
    setYesterday(format(yesterday));
  };

  getFormattedDates();
}, []);


const [rate, setRate] = useState(0)

useEffect(() => {
  function calc() {
    const result1 = data.find(item => item.name === yesterday);
    const result2 = data.find(item => item.name === today);

    const view1 = result1?.views ?? 0;
    const view2 = result2?.views ?? 0;

    let percentChange = 0;

    if (view1 === 0 && view2 > 0) {
      percentChange = 100;
    } else if (view1 === 0 && view2 === 0) {
      percentChange = 0;
    } else {
      percentChange = ((view2 - view1) / view1) * 100;
    }

    setRate(percentChange.toFixed(1));
  }

  if (data.length > 0) calc();
}, [data]);


useEffect(() => {
  async function fetchViewData() {
    if (!userName) return;
    if (currentWeek?.length === 0) return;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const newData = await Promise.all(
      currentWeek.map(async (dt, i) => {
        const views = await runViewSums(dt);
        return { name: days[i],"views" : views };
      })
    );

    setData(newData);
  }

  fetchViewData();
}, [currentWeek]);

const runViewSums = async (dt) => {
  try {
    const response = await fetch(
      `${API}/view/count/${userName}/${encodeURIComponent(dt)}`
    );
    const res = await response.json();
    if (response.ok) {
      return res.total ?? 0
    }
  } catch (error) {
    console.error(error);
    return
  }
};

  const stats = [
    { icon: FileText, label: "Total Posts", value: user.post_count, color: "text-blue-400" },
    { icon: Eye, label: "Total Views", value: user.view_count, color: "text-green-400" },
    { icon: Heart, label: "Total Likes", value: user.like_count, color: "text-red-400" },
    {
  icon: TrendingUp,
  label: rate === 0
    ? "No change"
    : rate > 0
      ? "Up by"
      : "Down by",
  value: Math.abs(rate), // remove negative sign for display
  suffix: "%",
  color: rate > 0
    ? "text-green-400"
    : rate < 0
      ? "text-red-400"
      : "text-gray-400"
}



  ]
  const maxViews = Math.max(...data.map(d => d.views), 1)

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold mb-6 text-white">Analytics Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-1 lg:grid-cols-2 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              role="button"
              className="bg-black backdrop-blur-sm p-3 lg:p-4 rounded-2xl border border-gray-800 group hover:border-gray-700 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <motion.div
                  className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-gray-400 transition-colors duration-300"
                  whileHover={{ scale: 1.5 }}
                />
              </div>
              <div className="text-2xl lg:text-xl font-bold text-white mb-1">
                <AnimatedCounter end={stat.value} duration={700} />
                {stat.suffix}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          className="bg-black backdrop-blur-sm m p-6 lg:col-span-2 rounded-2xl border border-gray-800"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-medium mb-4 text-white">Weekly Views</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} width={30} />
              <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorGrade(entry.views, maxViews)} // 400 is the max value (Fri)
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.section>
  )
}
