import {Twitter, Github, Instagram, Linkedin} from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-[#181818] text-white p-10">

      {/* Social Icons */}
      <div className="flex justify-center scale-[70%] cd:scale-[90%] gap-6 mb-8">
        <Twitter
          style={{ height: 48, width: 48 }}
        />
        <Instagram
          style={{ height: 48, width: 48 }}
        />
        <Github
          style={{ height: 48, width: 48 }}
        />
        <Linkedin
          style={{ height: 48, width: 48 }}
        />
      </div>
      {/* Copyright */}
      <div className="text-center text-xs text-gray-400">
        © 2024 Studio. All Rights Reserved.
      </div>
    </footer>
  );
}
export default Footer;
