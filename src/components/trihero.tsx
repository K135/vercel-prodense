'use client'

import React from 'react'
import Image from 'next/image'
import { DentalSearchForm } from './HeroSearchForm/DentalSearchForm'
import BgGlassmorphism from './BgGlassmorphism'
import AskTheDoctorChat from './AskTheDoctorChat'

const TriHero = () => {
  return (
    <div className="thrillophilia-hero">
      {/* Background */}
      <div className="hero-background">
        <div className="background-gradient"></div>
      </div>

      {/* Glassmorphism Background Effect */}
      <BgGlassmorphism className="absolute inset-0 flex items-center justify-center z-0" />

      {/* Floating Smiling Hero Cards - Left Side */}
      <div className="floating-cards-left" style={{ position: 'absolute', left: 0, top: '25%', transform: 'translateY(-50%)', zIndex: 1, opacity: 1 }}>
        <div className="cards-row cards-row-1" style={{ display: 'flex', gap: '20px', marginBottom: '30px', width: 'max-content', marginLeft: '-60px' }}>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '0.2s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling1.jpg" alt="Happy Patient 1" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Sarah M.</h4>
                  <p>Perfect Smile Makeover</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '0.4s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling2.png" alt="Happy Patient 2" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Mike R.</h4>
                  <p>Dental Implants</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '0.6s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling3.png" alt="Happy Patient 3" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Emma L.</h4>
                  <p>Teeth Whitening</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
        </div>
        
        <div className="cards-row cards-row-2" style={{ display: 'flex', gap: '20px', marginBottom: '30px', width: 'max-content', marginLeft: '-120px' }}>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '0.8s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling4.png" alt="Happy Patient 4" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>David K.</h4>
                  <p>Orthodontic Treatment</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '1.0s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling5.png" alt="Happy Patient 5" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Lisa T.</h4>
                  <p>Veneers</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '1.2s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling6.png" alt="Happy Patient 6" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>John P.</h4>
                  <p>Root Canal</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
        </div>
      </div>

      {/* Floating Smiling Hero Cards - Right Side */}
      <div className="floating-cards-right" style={{ position: 'absolute', right: 0, top: '25%', transform: 'translateY(-50%)', zIndex: 1, opacity: 1 }}>
        <div className="cards-row cards-row-1" style={{ display: 'flex', gap: '20px', marginBottom: '30px', width: 'max-content', justifyContent: 'flex-end', marginRight: '-60px' }}>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '0.3s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling7.png" alt="Happy Patient 7" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Anna S.</h4>
                  <p>Cosmetic Dentistry</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '0.5s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling8.png" alt="Happy Patient 8" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Tom W.</h4>
                  <p>Invisalign</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '0.7s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling9.png" alt="Happy Patient 9" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Maya C.</h4>
                  <p>Dental Cleaning</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
        </div>
        
        <div className="cards-row cards-row-2" style={{ display: 'flex', gap: '20px', marginBottom: '30px', width: 'max-content', justifyContent: 'flex-end', marginRight: '-120px' }}>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '0.9s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling10.png" alt="Happy Patient 10" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Alex B.</h4>
                  <p>Crown Placement</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '1.1s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling11.jpg" alt="Happy Patient 11" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Grace H.</h4>
                  <p>Smile Makeover</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          <div className="flip-card stunning-entrance" style={{ width: '110px', height: '110px', animationDelay: '1.3s' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/images/smiling-hero/prodence-smiling12.jpg" alt="Happy Patient 12" width={110} height={110} />
              </div>
              <div className="flip-back">
                <div className="card-info">
                  <h4>Ryan M.</h4>
                  <p>Periodontal Care</p>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
        </div>
      </div>

      {/* Monument Images - Left and Right */}
      <div className="monument-left">
        <Image 
          src="/images/monument india left.png" 
          alt="Left Monument India" 
          width={450} 
          height={900}
          style={{ opacity: 0.5 }}
        />
      </div>
      
      <div className="monument-right">
        <Image 
          src="/images/monument india right.png" 
          alt="Right Monument India" 
          width={450} 
          height={900}
          style={{ opacity: 0.5 }}
        />
      </div>

      {/* Central Content */}
      <div className="hero-center-content">
        <div className="hero-main-text">
          <h1 className="hero-title">
            Your Smile,<br />
            Perfectly <span className="highlight">Personalised!</span>
          </h1>
          <p className="hero-subtitle">
            Discover expert-led, D AI Y -powered dental care.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <span className="trust-icon">🦷</span>
            <span className="trust-text"><strong>Expert</strong> Dentists</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span className="trust-text"><strong>Accredited</strong> Clinics</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⭐</span>
            <span className="trust-text"><strong>4.8★</strong> Patient Reviews</span>
          </div>
        </div>

        {/* Dental Search Form */}
        <div className="dental-search-section">
          <DentalSearchForm formStyle="default" />
        </div>

        {/* AI Chat Bar - Below Search Form */}
        <div className="chat-section" style={{ marginTop: '218px' }}>
          <AskTheDoctorChat />
        </div>
      </div>

      <style jsx>{`
        .thrillophilia-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 80px;
          opacity: 0;
          animation: heroFadeIn 0.5s ease-out 0.1s forwards;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .background-gradient {
          width: 100%;
          height: 100%;
          background: transparent;
          position: relative;
          overflow: hidden;
        }

        .background-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 30%, rgba(243, 156, 18, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(230, 126, 34, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, rgba(243, 156, 18, 0.05) 0%, transparent 70%);
          animation: backgroundPulse 6s ease-in-out infinite;
        }

        @keyframes backgroundPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        .floating-cards-left {
          position: absolute;
          left: 0;
          top: 25%;
          transform: translateY(-50%);
          z-index: 1;
          opacity: 1;
        }

        .floating-cards-right {
          position: absolute;
          right: 0;
          top: 25%;
          transform: translateY(-50%);
          z-index: 1;
          opacity: 1;
        }

        .cards-row {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          animation: enhancedFloat 4s ease-in-out infinite;
          width: max-content;
        }

        .cards-row-1 {
          margin-left: -60px;
          animation-delay: 1s;
        }

        .cards-row-2 {
          margin-left: -120px;
          animation-delay: 1.5s;
        }

        .floating-cards-right .cards-row {
          justify-content: flex-end;
        }

        .floating-cards-right .cards-row-1 {
          margin-right: -60px;
          margin-left: 0;
          animation-delay: 1.2s;
        }

        .floating-cards-right .cards-row-2 {
          margin-right: -120px;
          margin-left: 0;
          animation-delay: 1.7s;
        }

        @keyframes enhancedFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .flip-card {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          perspective: 1000px;
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }

        .stunning-entrance {
          animation: stunningEntrance 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes stunningEntrance {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          60% {
            opacity: 0.8;
            transform: translateY(-10px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .flip-card:hover {
          transform: scale(1.05) translateY(-5px);
          box-shadow: 0 15px 40px rgba(243, 156, 18, 0.2);
        }

        .flip-inner {
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          position: relative;
        }

        .flip-card:hover .flip-inner {
          transform: rotateY(180deg);
        }

        .flip-front, .flip-back {
          width: 100%;
          height: 100%;
          position: absolute;
          backface-visibility: hidden;
          border-radius: 20px;
        }

        .flip-front {
          z-index: 2;
        }

        .flip-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #f39c12, #e67e22, #d35400);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          padding: 15px;
        }

        .card-info h4 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .card-info p {
          font-size: 11px;
          opacity: 0.95;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .rating {
          font-size: 12px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #f39c12, #e67e22, #f39c12, #e67e22);
          border-radius: 22px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
          animation: glowRotate 3s linear infinite;
        }

        .flip-card:hover .card-glow {
          opacity: 0.7;
        }

        @keyframes glowRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .flip-front img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
          transition: all 0.4s ease;
          filter: brightness(1.05) contrast(1.1) saturate(1.2);
        }

        .flip-card:hover .flip-front img {
          filter: brightness(1.15) contrast(1.2) saturate(1.3);
          transform: scale(1.05);
        }

        .flip-card::after {
          content: '';
          position: absolute;
          top: 10%;
          left: 10%;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: sparkle 2s ease-in-out infinite;
          z-index: 10;
        }

        .flip-card:nth-child(2)::after {
          animation-delay: 0.5s;
          top: 20%;
          left: 80%;
        }

        .flip-card:nth-child(3)::after {
          animation-delay: 1s;
          top: 70%;
          left: 20%;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .stunning-entrance:nth-child(1) { animation-delay: 0.2s; }
        .stunning-entrance:nth-child(2) { animation-delay: 0.4s; }
        .stunning-entrance:nth-child(3) { animation-delay: 0.6s; }
        .stunning-entrance:nth-child(4) { animation-delay: 0.8s; }
        .stunning-entrance:nth-child(5) { animation-delay: 1.0s; }
        .stunning-entrance:nth-child(6) { animation-delay: 1.2s; }

        .hero-center-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 800px;
          width: 100%;
          padding: 0 20px;
        }

        .hero-main-text {
          margin-bottom: 40px;
        }

        .hero-title {
          font-size: 64px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .highlight {
          color: #D35C2F;
        }

        .hero-subtitle {
          font-size: 20px;
          color: #7f8c8d;
          margin-bottom: 0;
        }

        .trust-indicators {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #2c3e50;
        }

        .trust-icon {
          font-size: 16px;
        }

        .dental-search-section {
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .floating-cards-left,
          .floating-cards-right {
            display: none;
          }
        }

        .monument-left {
          position: absolute;
          left: 0;
          bottom: 10%;
          z-index: 2;
          opacity: 0.5;
          pointer-events: none;
        }

        .monument-right {
          position: absolute;
          right: 0;
          bottom: 10%;
          z-index: 2;
          opacity: 0.5;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .monument-left,
          .monument-right {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 42px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .trust-indicators {
            gap: 20px;
          }

          .dental-search-section {
            padding: 0 20px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 32px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .trust-indicators {
            flex-direction: column;
            gap: 15px;
          }
        }
   please identify the image and add    `}</style>
    </div>
  )
}

export default TriHero