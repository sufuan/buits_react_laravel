import React, { useState, useEffect, useRef } from "react";
import { Head, Link, useForm } from '@inertiajs/react';
import { animated, useSpring, useSprings } from "react-spring";
import InputError from '@/Components/InputError';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import Arm1 from "./arm1.jsx";
import Arm2 from "./arm2.jsx";
import PeekingArms from "./PeekingArms.jsx";
import "./Login.css";

export default function Login({ status, canResetPassword }) {
  // Form handling with Inertia
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  // Animation states
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isTypingEmail, setIsTypingEmail] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [characterState, setCharacterState] = useState('default'); // default, typing, hiding
  const [cheat, setCheat] = useState(false);

  // Refs for input tracking
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Eye tracking animation - move pupils horizontally based on typing
  const updateEyePosition = (inputRef) => {
    if (!inputRef.current) return;

    const inputValue = inputRef.current.value;
    const inputLength = inputValue.length;

    // Debug logging
    console.log('Eye tracking - Input length:', inputLength, 'Value:', inputValue);

    // Calculate horizontal eye movement based on text length
    // Eyes move left to right as user types more characters
    const maxX = 6; // Increased maximum horizontal pupil movement for bigger eyes
    const minX = -3; // Increased minimum horizontal position

    // Map text length to eye position (0-25 characters = left to right movement)
    const progress = Math.min(inputLength / 25, 1); // Normalize to 0-1
    const x = minX + (maxX - minX) * progress;

    // Keep vertical movement minimal (just slight natural variation)
    const y = Math.sin(inputLength * 0.3) * 0.8; // Slightly more vertical variation for bigger eyes

    console.log('Eye position - X:', x, 'Y:', y, 'Progress:', progress);

    setEyePosition({ x, y });
  };

  // Handle email input changes - smooth eye tracking
  const handleEmailChange = (e) => {
    const value = e.target.value;
    console.log('Email input changed:', value); // Debug log
    console.log('Current data.email:', data.email); // Debug log

    setData('email', value);
    setIsTypingEmail(true);

    // Update eye position immediately based on text length
    updateEyePosition(emailInputRef);

    // Reset typing state after a delay
    clearTimeout(window.emailTypingTimeout);
    window.emailTypingTimeout = setTimeout(() => {
      setIsTypingEmail(false);
      if (!isTypingPassword) {
        setEyePosition({ x: 0, y: 0 }); // Return eyes to center
      }
    }, 2000); // Longer delay for smoother experience
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setData('password', value);
    setIsTypingPassword(true);
    setCharacterState('hiding');

    // Cheat detection (character peeking)
    if (value.length >= 3 && value.length < 7) {
      setCheat(true);
    } else {
      setCheat(false);
    }

    // Reset typing state after a delay
    clearTimeout(window.passwordTypingTimeout);
    window.passwordTypingTimeout = setTimeout(() => {
      setIsTypingPassword(false);
      if (!isTypingEmail) {
        setCharacterState('default');
      }
    }, 1000);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('login'), {
      onSuccess: () => {
        toast.success('Welcome back! Login successful.');
      },
      onError: (errors) => {
        if (errors.email) {
          toast.error(errors.email);
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      },
      onFinish: () => reset('password'),
    });
  };

  // Handle input focus
  const handleEmailFocus = () => {
    setIsTypingEmail(true);
    updateEyePosition(emailInputRef);
  };

  const handlePasswordFocus = () => {
    setIsTypingPassword(true);
    setCharacterState('hiding');
  };

  // Handle input blur
  const handleInputBlur = () => {
    setTimeout(() => {
      if (!isTypingEmail && !isTypingPassword) {
        setCharacterState('default');
        setEyePosition({ x: 0, y: 0 }); // Return eyes to center
      }
    }, 200);
  };

  // Spring animations
  const containerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 }
  });

  // Smooth, slow eye animation
  const leftEyeSpring = useSpring({
    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
    config: { tension: 120, friction: 80 } // Much slower and smoother
  });

  const rightEyeSpring = useSpring({
    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
    config: { tension: 120, friction: 80 } // Much slower and smoother
  });

  // Arms animation for password hiding and peeking
  const arms = [<Arm1 key="arm-1" cheat={cheat} />, <Arm2 key="arm-2" />];
  const peekingArms = <PeekingArms key="peeking-arms" isPeeking={showPassword} />;

  // Regular covering arms
  const armsSpring = useSprings(2, arms.map((_, i) => ({
    transform: (characterState === 'hiding' && !showPassword)
      ? "translate3d(0px,15px,0px)"
      : "translate3d(0px,400px,0px)",
    opacity: (characterState === 'hiding' && !showPassword) ? 1 : 0,
    delay: i * 100,
    config: { tension: 400, friction: 40 }
  })));

  // Peeking arms animation
  const peekingSpring = useSpring({
    transform: (characterState === 'hiding' && showPassword)
      ? "translate3d(0px,0px,0px)"
      : "translate3d(0px,300px,0px)",
    opacity: (characterState === 'hiding' && showPassword) ? 1 : 0,
    config: { tension: 300, friction: 35 }
  });

  const animatedArms = armsSpring.map((animatedStyle, index) => (
    <animated.g key={index} style={animatedStyle}>
      {arms[index]}
    </animated.g>
  ));

  const animatedPeekingArms = (
    <animated.g key="peeking" style={peekingSpring}>
      {peekingArms}
    </animated.g>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Head title="Login" />

      <animated.div style={containerSpring} className="w-full max-w-md">
        {/* Header with Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
         
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
          </div>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Status Message */}
        {status && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center animate-fade-in">
            {status}
          </div>
        )}

        {/* Main Login Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Login</CardTitle>

            {/* Animated Character */}
            <div className="flex justify-center my-6">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-56 h-56 drop-shadow-xl"
                  viewBox="0 0 200 200"
                >
                  <defs>
                    {/* Gradients for modern look */}
                    <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#e2e8f0" />
                    </linearGradient>
                    <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <clipPath id="armMask">
                      <circle cx="100" cy="100" r="95"></circle>
                    </clipPath>
                  </defs>

                  {/* Background Circle */}
                  <circle cx="100" cy="100" r="95" fill="url(#shirtGradient)" opacity="0.1"></circle>
                  {/* Neck */}
                  <rect x="85" y="140" width="30" height="25" fill="url(#faceGradient)" rx="15"></rect>

                  {/* Shirt/Body */}
                  <path
                    d="M70 165 Q100 155 130 165 L135 200 L65 200 Z"
                    fill="url(#shirtGradient)"
                  ></path>

                  {/* IT Society Logo on Shirt */}
                  <g transform="translate(90, 175)">
                    <rect x="0" y="0" width="20" height="15" fill="#ffffff" opacity="0.9" rx="2"></rect>
                    <text x="10" y="10" textAnchor="middle" fontSize="8" fill="#1d4ed8" fontWeight="bold">BUITS</text>
                  </g>

                  {/* Face */}
                  <ellipse cx="100" cy="100" rx="45" ry="50" fill="url(#faceGradient)"></ellipse>

                  {/* Hair */}
                  <path
                    d="M55 85 Q55 45 100 45 Q145 45 145 85 Q145 70 140 65 Q135 60 125 58 Q115 55 100 55 Q85 55 75 58 Q65 60 60 65 Q55 70 55 85"
                    fill="url(#hairGradient)"
                  ></path>

                  {/* Ears */}
                  <ellipse cx="55" cy="95" rx="8" ry="12" fill="url(#faceGradient)"></ellipse>
                  <ellipse cx="145" cy="95" rx="8" ry="12" fill="url(#faceGradient)"></ellipse>

                  {/* Eyebrows */}
                  <path d="M75 85 Q85 82 95 85" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none"></path>
                  <path d="M105 85 Q115 82 125 85" stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none"></path>

                  {/* Eyes with Tracking - Made Bigger */}
                  <g className="leftEye">
                    {/* Eye socket - Bigger */}
                    <ellipse cx="85" cy="95" rx="16" ry="12" fill="#ffffff"></ellipse>
                    <ellipse cx="85" cy="95" rx="16" ry="12" fill="none" stroke="#e2e8f0" strokeWidth="1"></ellipse>

                    {/* Iris - Bigger */}
                    <circle cx="85" cy="95" r="9" fill="#1e40af"></circle>

                    {/* Animated Pupil - Bigger */}
                    <animated.circle
                      style={leftEyeSpring}
                      cx="85"
                      cy="95"
                      r="4"
                      fill="#000000"
                    ></animated.circle>

                    {/* Eye shine - Bigger */}
                    <animated.circle
                      style={leftEyeSpring}
                      cx="87"
                      cy="93"
                      r="2"
                      fill="#ffffff"
                    ></animated.circle>
                  </g>

                  <g className="rightEye">
                    {/* Eye socket - Bigger */}
                    <ellipse cx="115" cy="95" rx="16" ry="12" fill="#ffffff"></ellipse>
                    <ellipse cx="115" cy="95" rx="16" ry="12" fill="none" stroke="#e2e8f0" strokeWidth="1"></ellipse>

                    {/* Iris - Bigger */}
                    <circle cx="115" cy="95" r="9" fill="#1e40af"></circle>

                    {/* Animated Pupil - Bigger */}
                    <animated.circle
                      style={rightEyeSpring}
                      cx="115"
                      cy="95"
                      r="4"
                      fill="#000000"
                    ></animated.circle>

                    {/* Eye shine - Bigger */}
                    <animated.circle
                      style={rightEyeSpring}
                      cx="117"
                      cy="93"
                      r="2"
                      fill="#ffffff"
                    ></animated.circle>
                  </g>
                  {/* Nose */}
                  <path d="M100 105 L98 115 Q100 117 102 115 Z" fill="#cbd5e1"></path>

                  {/* Mouth - Changes expression when peeking */}
                  <path
                    d={showPassword && characterState === 'hiding'
                      ? "M92 125 Q100 130 108 125" // Slightly surprised/guilty expression when peeking
                      : "M90 125 Q100 135 110 125" // Normal smile
                    }
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  ></path>

                  {/* Glasses (IT Society style) - Adjusted for bigger eyes */}
                  <g className="glasses" opacity="0.8">
                    {/* Left lens - Bigger to fit new eyes */}
                    <circle cx="85" cy="95" r="18" fill="none" stroke="#1e293b" strokeWidth="2"></circle>
                    <circle cx="85" cy="95" r="18" fill="#ffffff" opacity="0.1"></circle>

                    {/* Right lens - Bigger to fit new eyes */}
                    <circle cx="115" cy="95" r="18" fill="none" stroke="#1e293b" strokeWidth="2"></circle>
                    <circle cx="115" cy="95" r="18" fill="#ffffff" opacity="0.1"></circle>

                    {/* Bridge */}
                    <line x1="100" y1="95" x2="100" y2="95" stroke="#1e293b" strokeWidth="2"></line>

                    {/* Arms */}
                    <path d="M67 95 Q62 95 57 100" stroke="#1e293b" strokeWidth="2" fill="none"></path>
                    <path d="M133 95 Q138 95 143 100" stroke="#1e293b" strokeWidth="2" fill="none"></path>
                  </g>

                  {/* Animated Arms for Password Hiding and Peeking */}
                  <g className="arms" clipPath="url(#armMask)">
                    {animatedArms}
                    {animatedPeekingArms}
                  </g>

                  {/* Laptop/Computer Icon (IT Society theme) */}
                  <g transform="translate(75, 45)" opacity="0.3">
                    <rect x="0" y="0" width="50" height="30" fill="#64748b" rx="3"></rect>
                    <rect x="2" y="2" width="46" height="26" fill="#1e293b" rx="2"></rect>
                    <rect x="20" y="30" width="10" height="5" fill="#64748b"></rect>
                    <rect x="15" y="35" width="20" height="2" fill="#64748b" rx="1"></rect>
                  </g>
                </svg>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
          

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  Email Address
                </Label>
                <div className="relative">
                  <input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 focus:outline-none transition-all duration-300 bg-white/50"
                    placeholder="Enter your email address"
                    onChange={handleEmailChange}
                    onFocus={handleEmailFocus}
                    onBlur={handleInputBlur}
                    required
                    autoComplete="email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <InputError message={errors.email} className="mt-2" />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-500" />
                  Password
                </Label>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500 focus:outline-none transition-all duration-300 bg-white/50"
                    placeholder="Enter your password"
                    onChange={handlePasswordChange}
                    onFocus={handlePasswordFocus}
                    onBlur={handleInputBlur}
                    required
                    autoComplete="current-password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-110 shadow-lg"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password (Character will peek!)" : "Show password (Character will cover eyes!)"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 animate-pulse" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <InputError message={errors.password} className="mt-2" />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 shadow-sm focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>

                {canResetPassword && (
                  <Link
                    href={route('password.request')}
                    className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href={route('register')}
                  className="text-purple-600 hover:text-purple-500 font-semibold transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
        </div>
      </animated.div>
    </div>
  );
}
