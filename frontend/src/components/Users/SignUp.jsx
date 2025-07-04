import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, HomeIcon , Check} from "lucide-react";
import { useNavigate } from "react-router-dom";
import image1 from "./signup.jpg"
import { Helmet } from "react-helmet-async";
const API = import.meta.env.VITE_API_BASE_URL;


export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [alerts, setAlerts] = useState({});
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [closePrev, setClosePrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logging ,setLogging] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  const dropRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    setErrors(null);
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
  const nextStep = async () => {
    if (loading) return; // Prevent multiple clicks
    setApiError("");
    setLoading(true);

    try {
      if (step === 1) {
        if (validate()) {
          const isValid = await checkusername();
          if (isValid) {
            setStep(step + 1);
          } else {
            setApiError("Username is already taken.");
          }
        }
      } else if (step === 2) {
        if (validate()) {
          const isValid = await checkemail();
          if (isValid) {
            setStep(step + 1);
          } else {
            setApiError("Email is already in use.");
          }
        }
      } else if (step === 3) {
        if (validate()) {
          setStep(step + 1);
        }
      } else if (step === 4 && formData.acceptedTerms) {
        await handleSubmit();
      } else {
        if (validate()) {
          setStep(step + 1);
        }
      }
    } catch (error) {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => setStep(step - 1);

 const handleSubmit = async (e) => {
  e?.preventDefault(); // optional since sometimes you don't pass event
  setLogging(true)
  setApiError("");

  try {
    let url = `${API}/new/user`;
    let options;

    if (formData.image) {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("password", formData.confirmPassword);

      options = {
        method: "POST",
        body: form,
      };
    } else {
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.confirmPassword,
        }),
      };
    }

    const response = await fetch(url, options);
    const res = await response.json();

    if (response.ok) {
      console.log(res.message || "Success");
      setAlerts("Profile Created Successfully")
      setStep(step + 1);
    } else {
      console.error(res.message || "Registration failed");
      setApiError(res.message || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    setApiError("Something went wrong. Try again.");
  } finally {
    setLogging(false)
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    });
    setPreview(null);
  }
};


  const checkusername = async () => {
    setApiError(null);
    console.log(formData.username);
    const url = `${API}/check`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        i: "username",
        username: formData.username,
      }),
    };
    const response = await fetch(url, options);
    const reply = await response.json();
    console.log(reply.status);
    if (reply.status === 200) {
      return true;
    } else {
      return false;
    }
  };

  const checkemail = async () => {
    setApiError(null);
    console.log(formData.email);
    const url = `${API}/check`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        i: "email",
        email: formData.email,
      }),
    };
    const response = await fetch(url, options);
    const reply = await response.json();
    console.log(reply.status);
    if (reply.status === 200) {
      return true;
    } else {
      return false;
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score >= 4) return "Strong";
    if (score === 3) return "Moderate";
    return "Weak";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === 5 && formData.acceptedTerms) {
        handleSubmit();
      } else {
        nextStep();
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


  const steps = [1, 2, 3, 4, 5];

  return (
    <>
    <Helmet>
        <title>Create an account | Quilled</title>
        <meta name="description" content="Start your creative journey! Create an account now" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://quilled-5su6.onrender.com/signup" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />
  </Helmet>


    <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white sans z-50">
      <div className="flex w-[90%] h-[70%]">
      <div
      className={`relative h-full hidden cd:block ${show ? "cd:w-[50%] " : "cd:hidden"}`}
>
      <img
            alt="signup"
            src={image1}
            className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10"
></div>
      </div>
      <div className={`w-full ${show ? "cd:w-[50%]" : "cd:w-full"}  bg-gradient-to-br from-black via-black/90 to-black/80 border border-gray-700 p-8 cd:rounded-none rounded-2xl shadow-2xl space-y-6 overflow-hidden`}>
        <h1 className="text-2xl font-bold text-center ">Sign Up</h1>
        <div className="flex justify-center space-x-2 mb-4">
          {steps.map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${s <= step ? "bg-green-500" : "bg-gray-700"
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
                {apiError && (
                   <p
                    className="text-red-500 text-sm mt-1">{apiError + " "}<span
                      onClick={() => navigate('/login')} className="hover:underline cursor-pointer"
                    >Login?</span></p>
                )}

                {loading && (
                  <p className="text-gray-400 text-sm mt-2">Processing...</p>
                )}
                {errors.username && (
                  <p
                    className="text-red-500 text-sm mt-1">{errors.username + ". "}<span
                      onClick={() => navigate('/login')} className="hover:underline cursor-pointer"
                    >Login?</span></p>
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
                  <p
                    className="text-red-500 text-sm mt-1">{errors.email + " "}<span
                      onClick={() => navigate('/login')} className="hover:underline cursor-pointer"
                    >Login?</span></p>
                )}
                {apiError && (
                  <p
                    className="text-red-500 text-sm mt-1">{apiError + ". "}<span
                      onClick={() => navigate('/login')} className="hover:underline cursor-pointer"
                    >Login?</span></p>
                )}

                {loading && (
                  <p className="text-gray-400 text-sm mt-2">Processing...</p>
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
                    className={`font-bold ${getPasswordStrength() === "Strong"
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
                    className="mt-1 mr-2 p-2"
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
                    {!logging ? <span>Signup</span> : <div className="w-6 h-6 border-2 border-b-transparent rounded-full animate-spin"></div>}
                  </button>
                </div>
              </div>
            )}
            {
          step === 5 && (
            <div className="flex flex-col items-center space-y-3 rounded-lg mt-10">
              <div className="w-16 h-16  bg-green-600 rounded-full flex items-center justify-center mb-2">
                <Check className="w-12 h-12  animate-pulse text-white" />
              </div>
              <p className="text-white text-center text-sm font-medium">{alerts}</p>
              <button
                onClick={() => {
                      setLogging(true)
                      navigate(`/login`)
              }}
                className="px-6 py-2 bg-green-700 text-slate-200 font-sans mt-4 hover:bg-green-600 rounded-md font-bold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!logging ? <span>Go to Login</span> : <div className="w-6 h-6 border-2 border-b-transparent rounded-full animate-spin"></div>}
              </button>
            </div>
  )
}
            {/* Navigation Links */}

        {step !== 5 && (
  <div className="flex mt-6 gap-2 items-center">
    <p
      onClick={() => navigate("/login")}
      className="text-xs text-green-400 hover:text-green-300 underline cursor-pointer transition duration-200"
    >
      Already a member? <span className="font-medium">Login</span>
    </p>
    <p
      onClick={() => navigate("/")}
      className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer transition duration-200"
    >
      Take me home
    </p>
  </div>
)}

          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </div>
    </>
  );
}
