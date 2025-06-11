import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  const auth = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (validate()) {
      const data = {
        email: email,
        password: password,
      };
      const url = "http://127.0.0.1:5000/get/user";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(url, options);
      const results = await response.json();
      if(results.status == 402){
        newErrors.password = "Invalid Password"
        setErrors(newErrors)
          
      }else if(results.status == 401){
        setStep(1)
        newErrors.email = "Invalid Email"
        setErrors(newErrors)

      }
      else if (response.status === 200){
        console.log("Successful")
      }
    }
  };

  const steps = [1, 2];

  useEffect(() => {
    // Auto-focus current step input
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

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white font-sans z-50">
      <div className="w-[90%] scale-[90%] md:w-[38rem] bg-gradient-to-br from-black/70 to-black border border-gray-700 p-8 rounded-2xl shadow-2xl space-y-6 overflow-hidden">
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

        {/* Step Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Step 1 - Email */}
            {step === 1 && (
              <div>
                <label className="block text-sm mb-1 text-gray-400">
                  Email
                </label>
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
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                <button
                  role="button"
                  onClick={nextStep}
                  className="w-16 h-8 mt-2 float-right bg-green-600 hover:bg-green-700 text-white rounded-md font-bold uppercase tracking-wide"
                >
                  Next
                </button>
              </div>
            )}

            {/* Step 2 - Password */}
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

                <div className="flex justify-between">
                  <ArrowLeft
                    role="button"
                    onClick={prevStep}
                    className="w-16 h-8 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold uppercase tracking-wide"
                  />
                  <button
                    type="submit"
                    onClick={auth}
                    className="w-fit mt-2 bg-green-600 hover:bg-green-700 text-white py-[.3rem] px-4 rounded-md font-bold uppercase tracking-wide"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
