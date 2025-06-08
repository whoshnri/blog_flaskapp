import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (step === 1 && !formData.username.trim())
      newErrors.username = "Username is required";
    if (step === 2 && !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (step === 3) {
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validate()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    if (!formData.acceptedTerms) return;
    console.log("Submitted:", formData);
  };

  const getPasswordStrength = () => {
    const length = formData.password.length;
    if (length > 10) return "Strong";
    if (length >= 6) return "Moderate";
    return "Weak";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === 4) {
        handleSubmit();
      } else {
        nextStep();
      }
    }
  };

  const steps = [1, 2, 3, 4];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white sans z-50">
      <div className="w-[90%] md:w-[38rem] bg-gradient-to-br from-black via-black/90 to-black/80 border border-gray-700 p-8 rounded-2xl shadow-2xl space-y-6 overflow-hidden">
        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>

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

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {step === 1 && (
              <div>
                <label className="block mb-1 text-gray-400">
                  Create Username
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  onKeyDown={handleKeyDown}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-gray-600"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="block mb-1 text-gray-400">
                  Email Address
                </label>
                <input
                  ref={inputRef}
                  type="email"
                  name="email"
                  onKeyDown={handleKeyDown}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-gray-600"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                <div className="flex justify-between mt-4">
                  <ArrowLeft
                    role="button"
                    onClick={prevStep}
                    className="w-16 h-9 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold uppercase tracking-wide"
                  ></ArrowLeft>
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block mb-1 text-gray-400">
                  Create Password
                </label>
                <div className="relative mb-1">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-md focus:outline-none relative focus:ring focus:ring-gray-600 "
                  />
                  <div
                    className="absolute right-3 top-[.8rem] cursor-pointer text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
                <p className="text-sm mb-2 text-gray-400">
                  Strength:{" "}
                  <span
                    className={`font-bold ${
                      getPasswordStrength() === "Strong"
                        ? "text-green-400"
                        : getPasswordStrength() === "Moderate"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {getPasswordStrength()}
                  </span>
                </p>
                {errors.password && (
                  <p className="text-red-500 text-sm mb-1">{errors.password}</p>
                )}

                <label className="block mb-1 text-gray-400">
                  Confirm Password
                </label>
                <div className="relative mb-1">
                  <input
                    type={showCPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-md focus:outline-none relative focus:ring focus:ring-gray-600"
                  />
                  <div
                    className="absolute right-3 top-[.8rem] cursor-pointer text-gray-400"
                    onClick={() => setShowCPassword(!showCPassword)}
                  >
                    {showCPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}

                <div className="flex justify-between mt-4">
                  <ArrowLeft
                    role="button"
                    onClick={prevStep}
                    className="w-16 h-9 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold uppercase tracking-wide"
                  ></ArrowLeft>
                  <button
                    onClick={nextStep}
                    onKeyDown={handleKeyDown}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="flex items-start mb-4">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="mt-1 mr-2"
                  />
                  <label className="text-sm text-gray-400">
                    I agree to the{" "}
                    <span className="text-blue-400 underline cursor-pointer">
                      Terms and Conditions
                    </span>
                  </label>
                </div>
                <div className="flex justify-between">
                  <ArrowLeft
                    role="button"
                    onClick={prevStep}
                    className="w-16 h-9 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold uppercase tracking-wide"
                  ></ArrowLeft>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.acceptedTerms}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold disabled:opacity-50"
                  >
                    Finish
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
