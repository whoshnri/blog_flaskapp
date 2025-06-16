"use client"

import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { Eye, Heart, FileText, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

const data = [
  { name: "Mon", views: 120 },
  { name: "Tue", views: 190 },
  { name: "Wed", views: 300 },
  { name: "Thu", views: 250 },
  { name: "Fri", views: 400 },
  { name: "Sat", views: 350 },
  { name: "Sun", views: 280 },
]
const maxViews = Math.max(...data.map(d => d.views))

const stats = [
  { icon: FileText, label: "Total Posts", value: 1247, color: "text-blue-400" },
  { icon: Eye, label: "Total Views", value: 89432, color: "text-green-400" },
  { icon: Heart, label: "Total Likes", value: 12847, color: "text-red-400" },
  { icon: TrendingUp, label: "Growth Rate", value: 23, color: "text-purple-400", suffix: "%" },
]


const colorGrade = (num, max) => {
  const rangeIndex = Math.ceil((num / max) * 100);

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


export default function AnalyticsPanel() {
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
              className="bg-gray-900/50 backdrop-blur-sm p-3 lg:p-4 rounded-2xl border border-gray-800 group hover:border-gray-700 transition-all duration-300"
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
                <AnimatedCounter end={stat.value} duration={1400} />
                {stat.suffix}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          className="bg-gray-900/50 backdrop-blur-sm m p-6 lg:col-span-2 rounded-2xl border border-gray-800"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-medium mb-4 text-white">Weekly Views</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} width={30}/>
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
