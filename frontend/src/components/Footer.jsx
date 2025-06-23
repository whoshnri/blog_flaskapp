import {Twitter, Github, Instagram, Linkedin} from 'lucide-react'
import {useNavigate} from "react-router-dom"

function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="bg-black text-white p-10">

      {/* Social Icons */}
      <div className="flex justify-center scale-[70%] cd:scale-[90%] gap-6 mb-8">
        <a
        href="https://instagram.com/xyz_07hb"
                target="_blank"
                rel="noopener noreferrer"
        >
        <Instagram
        alt="instagramicon"
         className="hover:stroke-blue-500 hover:cursor-pointer"
          style={{ height: 48, width: 48 }}
        />
        </a>
        <a
        href="https://github.com/whoshnri"
                target="_blank"
                rel="noopener noreferrer"
        >
        <Github
        alt="githubicon"
         className="hover:stroke-blue-500 hover:cursor-pointer"
          style={{ height: 48, width: 48 }}
        />
        </a>
        <a
        href="https://x.com/xyz_07hb"
                target="_blank"
                rel="noopener noreferrer"
        >
        <Twitter
        alt="twittericon"
         className="hover:stroke-blue-500 hover:cursor-pointer"
          style={{ height: 48, width: 48 }}
        />
        </a>
      </div>
      {/* Copyright */}
      <div className="text-center text-xs text-gray-400">
        © 2025 Henry Bassey. All Rights Reserved.
      </div>
    </footer>
  );
}
export default Footer;
