'use client'

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SparklesIcon, ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import clsx from 'clsx';
import GeminiBorder from './GeminiBorder';
import { useAIAssistant } from '@/contexts/AIAssistantContext';

export default function AskTheDoctorChat() {
  const { openAssistant, isExpanded } = useAIAssistant();
  const [expanded, setExpanded] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  const placeholders = useMemo(() => [
    "Got a toothache? 🦷",
    "Wondering about braces? 😊",
    "Ask me anything about your smile 😁",
    "Need a dental checkup? 🔍",
    "Curious about teeth whitening? ✨",
    "Questions about dental implants? 💎"
  ], []);

  // Scroll detection to show chat after hero section
  useEffect(() => {
    const handleScroll = () => {
      // Show chat when user scrolls past 80vh (hero section height)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      setShouldShow(scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial animation delay
  useEffect(() => {
    if (!shouldShow) return;
    
    const timer = setTimeout(() => {
      setShowInitialAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  // Typing animation effect
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
        
        // Wait before starting next placeholder
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [placeholderIndex, placeholders, showInitialAnimation]);

  const handleExpand = () => {
    if (expanded) return;
    
    setExpanded(true);
    // Open the shared AI assistant popup instead of showing local chat
    setTimeout(() => {
      openAssistant();
      // Reset to collapsed state after opening popup
      setExpanded(false);
    }, 300);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setExpanded(false);
      setIsExiting(false);
    }, 300);
  };

  const containerVariants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.5
      }
    },
    exit: { scale: 0, opacity: 0 }
  };

  const circleVariants: Variants = {
    initial: { scale: 1, opacity: 1 },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const expandedVariants: Variants = {
    initial: { 
      width: 64, 
      height: 64, 
      borderRadius: "50%" 
    },
    animate: { 
      width: 320, 
      height: 56, 
      borderRadius: "28px",
      paddingLeft: 16,
      paddingRight: 16,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.6
      }
    }
  };

  // Don't render if AI assistant popup is open or if not scrolled past hero
  if (isExpanded || !shouldShow) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative"
      >
        {/* Initial circular state */}
        <AnimatePresence>
          {showInitialAnimation && (
            <motion.div
              variants={circleVariants}
              initial="initial"
              exit="exit"
              onClick={handleExpand}
              className="w-16 h-16 bg-[#D35C2F] rounded-full shadow-2xl cursor-pointer flex items-center justify-center hover:scale-110 transition-transform duration-200"
            >
              <Image
                src="/images/prodence%20p%20white.png"
                alt="Prodence"
                width={32}
                height={32}
                className="object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded horizontal state */}
        <AnimatePresence>
          {!showInitialAnimation && (
            <motion.div
              variants={expandedVariants}
              initial="initial"
              animate="animate"
              onClick={handleExpand}
              className="bg-gradient-to-r from-[#E6B862] to-[#D35C2F] shadow-2xl cursor-pointer flex items-center hover:scale-105 transition-transform duration-200 relative overflow-hidden"
            >
              {/* Left icon - fixed position */}
              <div className="absolute left-4 w-8 h-8 bg-[#D35C2F] rounded-full flex items-center justify-center">
                <Image
                  src="/images/prodence%20p%20white.png"
                  alt="Prodence"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              
              {/* Content area - with left margin to avoid icon */}
              <div className="flex flex-col items-start ml-16 flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white font-semibold text-sm whitespace-nowrap"
                >
                  Ask the Doctor
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/80 text-xs h-4 flex items-center w-full"
                >
                  <span className="block w-48 overflow-hidden">
                    {currentText}
                  </span>
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-1"
                    >
                      |
                    </motion.span>
                  )}
                </motion.div>
              </div>

              {/* Right icon - fixed position */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute right-4 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#E6B862] rounded-full"
              animate={{
                x: [0, 20, -20, 0],
                y: [0, -20, 20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${20 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}