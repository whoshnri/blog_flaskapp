import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import loginIcon from "./Login-bro.svg"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const steps = [1, 2];

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const nextStep = () => {
    if (validate()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 1) {
      if (!email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Invalid Email format";
      }
    }

    if (step === 2) {
      if (!password.trim()) {
        newErrors.password = "Password is required.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const auth = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (validate()) {
      const data = { email, password };
      const response = await fetch("http://127.0.0.1:5000/get/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const results = await response.json();

      if (results.status === 402) {
        newErrors.password = "Invalid Password";
        setErrors(newErrors);
      } else if (results.status === 401) {
        setStep(1);
        newErrors.email = "Invalid Email";
        setErrors(newErrors);
      } else if (response.status === 200) {
        localStorage.setItem("token", results.token);
        navigate(`/dashboard/${results.username}/${results.uuid}`);
      }
    }
  };
  const [show, setShow] = useState(true);

  useEffect(() => {
  const checkRatio = () => {
    const { innerHeight: h, innerWidth: w } = window;
    const result = w > h;
    setShow(result);
  };
  checkRatio()
  window.addEventListener("resize", checkRatio);
  return () => window.removeEventListener("resize", checkRatio);
}, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white sans z-50">
    <div className="flex w-[90%] h-[70%]">
      <div className={`relative cd:w-[50%] h-full hidden cd:block ${show ? "" : "cd:hidden"}`}>
  <img
    src={loginIcon}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/10 z-10"></div>
</div>

      <div className={`w-full ${show ? "cd:w-[50%]" : "cd:w-full"}  bg-gradient-to-br from-black via-black/90 to-black/80 border border-gray-700 p-8 cd:rounded-none rounded-2xl shadow-2xl space-y-6 overflow-hidden`}>
        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>

        {/* Step Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-4">
          {steps.map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${
                s <= step ? "bg-green-500" : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {step === 1 && (
              <div className="pb-6">
                <label className="block text-sm mb-1 text-gray-400">Email</label>
                <input
                  type="email"
                  ref={inputRef}
                  value={email}
                  onKeyDown={(e) => e.key === "Enter" && nextStep()}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-black/40 border ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.email
                      ? "focus:ring-red-500"
                      : "focus:ring-green-500 focus:border-green-500"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email + ". "}
                    <span
                      onClick={() => navigate("/signup")}
                      className="hover:underline cursor-pointer"
                    >
                      Join?
                    </span>
                  </p>
                )}
                <button
                  role="button"
                  onClick={nextStep}
                  className="w-20 h-9 mt-3 float-right bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all duration-200 ease-in-out shadow-md hover:scale-[1.03] rounded-md text-sm font-semibold"
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="relative">
                <label className="block text-sm mb-1 text-gray-400">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  ref={inputRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && auth(e)}
                  className={`w-full bg-black/40 border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.password
                      ? "focus:ring-red-500"
                      : "focus:ring-green-500 focus:border-green-500"
                  } pr-10`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <div
                  className="absolute right-3 top-[2.1rem] cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>

                <div className="flex justify-between mt-4">
                  <ArrowLeft
                    role="button"
                    onClick={prevStep}
                    className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-md p-1 transition-all duration-200 ease-in-out shadow-md hover:scale-105"
                  />
                  <button
                    type="submit"
                    onClick={auth}
                    className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all duration-200 ease-in-out shadow-md hover:scale-[1.03] px-5 py-2 rounded-md text-sm font-semibold"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
            <div className="flex mt-6 gap-2 items-center">
          <p
            onClick={() => navigate("/signup")}
            className="text-xs text-green-400 hover:text-green-300 underline cursor-pointer transition duration-200"
          >
            New here? <span className="font-medium">Join now</span>
          </p>
          <p
            onClick={() => navigate("/")}
            className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer transition duration-200"
          >Take me home</p>
        </div>
          </motion.div>

        </AnimatePresence>

        {/* Navigation Links */}
      </div>

      </div>
    </div>
  );
}
