"use client"

import bgpixel from '../../../assets/bgpixel.jpg'
import { motion } from "framer-motion"
import { User2Icon, Share2, HomeIcon, BellIcon, SettingsIcon, PencilIcon, User, LogOut } from "lucide-react"
import { useState } from 'react'
import {useNavigate, useParams} from "react-router-dom"

export default function HeaderSidebar({user}) {
  const navigate = useNavigate()

  return (
    <motion.aside
      className="my-0 px-2 cd:my-0 cd:px-0"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="relative flex flex-col cd:w-[280px] overflow-hidden cd:h-screen rounded-lg cd:rounded-none cd:fixed top-0 left-0 p-6 scale-[0.95] cd:scale-100 cd:pt-12 transition-transform duration-300 ease-in-out"

        style={{
          backgroundImage: `url(${bgpixel})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='absolute left-0 right-0 bottom-0 top-0 bg-black/60 backdrop-blur-[3px]'></div>

        <motion.div
          className="flex justify-center mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src="/placeholder.svg?height=64&width=64"
            alt="Profile"
            width={130}
            height={130}
            className="rounded-full ring-2 ring-white ring-offset-2 mt-4 ring-offset-black z-10"
          />
        </motion.div>

        {/* Greeting and icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-center text-white z-10"
        >
          <h1 className="text-2xl font-bold">Welcome back, {user.username}</h1>
          <span className="block text-sm my-1 text-gray-300 roman font-bold">{user.email}</span>
          <div className="flex justify-center gap-5 mt-2">
            <BellIcon
              role='button'
              className="w-5 h-5 hover:text-yellow-400 transition" />
            <SettingsIcon
              role='button'
              className="w-5 h-5 hover:text-blue-400 transition" />
            <LogOut
              onClick={() =>  navigate("/logout")}
              role='button'
              className="w-5 h-5 cd:hidden hover:text-blue-400 transition" />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-3 grid grid-cols-3 gap-2 border-gray-800 border-t pt-4 w-fit mx-auto text-center text-sm text-white z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "Followers", value: user.followers },
            { label: "Blogs", value: user.post_count },
            { label: "Likes", value: user.like_count},
          ].map(({ label, value }, idx) => (
            <div key={idx} className="grid grid-rows-2 px-2">
              <span className="text-lg font-extrabold">{value}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          className="mt-8 flex  cd:flex-col gap-3 mx-auto w-fit cd:w-full text-sm text-gray-300 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: "Logout", icon: LogOut, showOnMobile: false },
            { label: "Bio", icon: User2Icon, showOnMobile: true },
            { label: "Share", icon: Share2, showOnMobile: true },
            { label: "Create", icon: PencilIcon, showOnMobile: true },
          ].map(({ label, icon: Icon, showOnMobile }, idx) => (
            <div
              role="button"
              key={idx}
              onClick={() => {
                if(label == 'Create'){
                  navigate(`/new/${user.username}/${user.uuid}`)
                }else if(label == "LogOut"){
                  navigate("/logout");
                }
              }}
              tabIndex={0}
              className={`
                flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10 hover:text-white focus:bg-white/20 focus:outline-none transition
                ${!showOnMobile ? "hidden cd:flex" : "flex"}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </div>
          ))}
          <div className='opacity-0 cd:opacity-100 absolute bottom-0 right-0 left-0 text-center'>Made with 💖 by Henry</div>
        </motion.div>


      </div>
    </motion.aside>
  )
}
