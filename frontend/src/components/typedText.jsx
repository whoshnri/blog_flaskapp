import React, { useState, useEffect } from "react";

function TypedText({ strings = [], typeSpeed = 100, backSpeed = 50, loop = true }) {
  const [text, setText] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;

    const currentString = strings[stringIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentString.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex + 1 === currentString.length) {
          if (loop || stringIndex < strings.length - 1) {
            setTimeout(() => setIsDeleting(true), 800); // pause before deleting
          } else {
            setDone(true);
          }
        }
      } else {
        setText(currentString.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setStringIndex((prev) => (prev + 1) % strings.length);
        }
      }
    }, isDeleting ? backSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, stringIndex, done]);

  return <span>{text}{!done && <span className="animate-pulse">_</span>}</span>;
}

export default TypedText;
