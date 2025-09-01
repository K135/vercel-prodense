'use client'

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function AskTheDoctorChat() {
  const [expanded, setExpanded] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const placeholders = useMemo(() => [
    "Got a toothache? 🦷",
    "Wondering about braces? 😊",
    "Ask me anything about your smile 😁",
    "Need a dental checkup? 🔍",
    "Curious about teeth whitening? ✨",
    "Questions about dental implants? 💎"
  ], []);

  // Initial animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Typing effect for placeholder texts
  useEffect(() => {
    if (showInitialAnimation) return;

    const currentPlaceholder = placeholders[placeholderIndex];
    let currentIndex = 0;
    setIsTyping(true);
    setCurrentText("");

    const typingInterval = setInterval(() => {
      if (currentIndex <= currentPlaceholder.length) {
        setCurrentText(currentPlaceholder.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Wait before switching to next placeholder
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 2000);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, [placeholderIndex, showInitialAnimation, placeholders]);

  // Handle exit animation sequence
  const handleClose = () => {
    setIsExiting(true);
    
    // First, collapse the popup
    setExpanded(false);
    
    // Then show the tooth icon (round state)
    setTimeout(() => {
      setShowInitialAnimation(true);
    }, 200);
    
    // Finally expand to bar and finish
    setTimeout(() => {
      setShowInitialAnimation(false);
    }, 1000);
    
    // Clean up exit state
    setTimeout(() => {
      setIsExiting(false);
    }, 1800);
  };

  const toothMorphVariants = {
    initial: { 
      scale: 0, 
      borderRadius: "50%"
    },
    tooth: { 
      scale: 1, 
      borderRadius: "50%",
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        duration: 1.2
      }
    },
    bar: { 
      scale: 1, 
      borderRadius: "30px",
      transition: { 
        duration: 0.8, 
        ease: "easeInOut",
        delay: 0.5
      }
    },
    exitToTooth: {
      scale: 1,
      borderRadius: "50%",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.6
      }
    },
    exitToBar: {
      scale: 1,
      borderRadius: "30px",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    hover: {
      boxShadow: [
        "0 0 20px rgba(219, 49, 22, 0.3)",
        "0 0 40px rgba(219, 49, 22, 0.5)",
        "0 0 20px rgba(219, 49, 22, 0.3)"
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const waveRevealVariants = {
    hidden: { 
      height: 60, 
      borderRadius: 30,
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      y: 0
    },
    visible: { 
      height: 450, 
      borderRadius: 20,
      y: -390, // Move up by the difference in height (450 - 60 = 390)
      background: [
        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
      ],
      transition: { 
        duration: 0.8, 
        ease: "easeInOut",
        background: {
          duration: 0.3,
          times: [0, 0.5, 1]
        }
      }
    },
    exit: {
      height: 60,
      borderRadius: 30,
      y: 0,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative z-10 flex justify-center">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="collapsed"
            variants={toothMorphVariants}
            initial="initial"
            animate={
              isExiting 
                ? (showInitialAnimation ? "exitToTooth" : "exitToBar")
                : (showInitialAnimation ? "tooth" : "bar")
            }
            exit={{ opacity: 0, scale: 1, y: 0 }}
            whileHover={!isExiting ? "hover" : undefined}
            className="relative cursor-pointer group"
            onClick={() => !isExiting && setExpanded(true)}
          >
            <motion.div
              variants={glowVariants}
              className="bg-gradient-to-r from-white via-gray-50 to-white shadow-2xl flex items-center border border-gray-100"
              style={{
                width: showInitialAnimation ? 70 : 380,
                height: 70,
                borderRadius: showInitialAnimation ? "50%" : "35px",
                padding: showInitialAnimation ? "14px" : "12px 16px",
                justifyContent: showInitialAnimation ? "center" : "flex-start",
                transition: showInitialAnimation 
                  ? "width 0.1s ease-out, border-radius 0.1s ease-out, padding 0.1s ease-out"
                  : "width 0.8s ease-in-out 0.5s, border-radius 0.8s ease-in-out 0.5s, padding 0.8s ease-in-out 0.5s"
              }}
            >
              {/* Tooth/Sparkle Icon */}
              <motion.div 
                className="relative flex items-center justify-center"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #DB3116 0%, #ff4d2e 100%)",
                  marginRight: showInitialAnimation ? 0 : 12
                }}
              >
                <div className="text-white flex items-center justify-center">
                  {showInitialAnimation ? (
                    <Image
                      src="/images/prodence p white.png"
                      alt="Prodense Logo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  ) : (
                    <motion.div
                      variants={sparkleVariants}
                      animate="animate"
                    >
                      <SparklesIcon className="w-6 h-6" />
                    </motion.div>
                  )}
                </div>
                
                {/* Floating sparkles around the icon */}
                <motion.div
                  className="absolute -top-1 -right-1 text-yellow-400 text-xs"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-1 text-blue-400 text-xs"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [360, 180, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  💫
                </motion.div>
              </motion.div>

              {/* Title and Placeholder Text */}
              {!showInitialAnimation && (
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <h3 className="text-sm font-bold text-gray-800">Ask the Doctor</h3>
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#DB3116]" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="text-gray-600 text-sm h-5 flex items-center"
                  >
                    <span className="truncate">
                      {currentText}
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="ml-1 text-[#DB3116]"
                        >
                          |
                        </motion.span>
                      )}
                    </span>
                  </motion.div>
                </div>
              )}

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#DB3116]/10 via-transparent to-[#DB3116]/10 animate-pulse"></div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            variants={waveRevealVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white w-96 shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            style={{ borderRadius: 20 }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-[#DB3116] to-[#ff4d2e]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Image
                    src="/images/prodence p white.png"
                    alt="Prodense Logo"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Ask the Doctor</h3>
                  <p className="text-white/80 text-xs">AI Dental Assistant</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-white"
            >
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 max-w-[80%]"
                >
                  <p className="text-gray-700 text-sm">
                    👋 Hi! I&apos;m your AI dental assistant. I can help you with:
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 max-w-[80%]"
                >
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Dental procedure information</li>
                    <li>• Appointment scheduling</li>
                    <li>• Treatment recommendations</li>
                    <li>• Oral health tips</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-gradient-to-r from-[#DB3116]/10 to-[#ff4d2e]/10 p-3 rounded-2xl border border-[#DB3116]/20 max-w-[80%]"
                >
                  <p className="text-gray-700 text-sm">
                    What would you like to know about your dental health? 😊
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 border-t border-gray-100 bg-white"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your dental question..."
                  className="flex-1 p-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#DB3116]/50 focus:border-[#DB3116] text-sm transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-gradient-to-r from-[#DB3116] to-[#ff4d2e] text-white rounded-2xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  Send
                </motion.button>
              </div>
              
              {/* Quick suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex gap-2 mt-3 flex-wrap"
              >
                {["Tooth pain", "Whitening", "Braces", "Checkup"].map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-[#DB3116]/10 text-gray-600 hover:text-[#DB3116] rounded-full text-xs font-medium transition-all border hover:border-[#DB3116]/30"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}