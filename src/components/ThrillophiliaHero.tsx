'use client'

import React from 'react'
import Image from 'next/image'

const ThrillophiliaHero = () => {
  return (
    <div className="thrillophilia-hero">
      {/* Background */}
      <div className="hero-background">
        <div className="background-gradient"></div>
      </div>

      {/* Floating Destination Cards - Left Side */}
      <div className="floating-cards-left">
        <div className="cards-row cards-row-1">
          <div className="flip-card" style={{ width: '107px', height: '107px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d1.svg" alt="Destination 1" width={107} height={107} />
              </div>
            </div>
          </div>
          <div className="flip-card" style={{ width: '86px', height: '86px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d2.png" alt="Destination 2" width={86} height={86} />
              </div>
            </div>
          </div>
          <div className="flip-card" style={{ width: '64px', height: '64px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d3.png" alt="Destination 3" width={64} height={64} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="cards-row cards-row-2">
          <div className="flip-card" style={{ width: '107px', height: '107px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d4.png" alt="Destination 4" width={107} height={107} />
              </div>
            </div>
          </div>
          <div className="flip-card" style={{ width: '86px', height: '86px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d5.png" alt="Destination 5" width={86} height={86} />
              </div>
            </div>
          </div>
          <div className="flip-card" style={{ width: '75px', height: '75px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d6.png" alt="Destination 6" width={75} height={75} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Destination Cards - Right Side */}
      <div className="floating-cards-right">
        <div className="cards-row cards-row-1">
          <div className="flip-card" style={{ width: '107px', height: '107px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d7.png" alt="Destination 7" width={107} height={107} />
              </div>
            </div>
          </div>
          <div className="flip-card" style={{ width: '86px', height: '86px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d8.png" alt="Destination 8" width={86} height={86} />
              </div>
            </div>
          </div>
          <div className="flip-card" style={{ width: '64px', height: '64px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d9.png" alt="Destination 9" width={64} height={64} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="cards-row cards-row-2">
          <div className="flip-card" style={{ width: '107px', height: '107px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d10.png" alt="Destination 10" width={107} height={107} />
              </div>
            </div>
          </div>
          <div className="flip-card" style={{ width: '86px', height: '86px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d11.png" alt="Destination 11" width={86} height={86} />
              </div>
            </div>
          </div>
          <div className="flip-card" style={{ width: '75px', height: '75px' }}>
            <div className="flip-inner">
              <div className="flip-front">
                <Image src="/d12.png" alt="Destination 12" width={75} height={75} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Central Content */}
      <div className="hero-center-content">
        <div className="hero-main-text">
          <h1 className="hero-title">
            Your Tour,<br />
            Perfectly <span className="highlight">Personalised!</span>
          </h1>
          <p className="hero-subtitle">
            Explore Expert-led, AI-powered multi-day tours.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <span className="trust-icon">🕐</span>
            <span className="trust-text"><strong>24/7</strong> Support</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span className="trust-text"><strong>Seamless</strong> Booking</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⭐</span>
            <span className="trust-text"><strong>4.6★</strong> Rated By 3M+</span>
          </div>
        </div>

        {/* Tour Customization Interface */}
        <div className="tour-customization">
          <div className="customization-card">
            <div className="activity-item">
              <div className="activity-image">
                <Image src="/activity1.jpg" alt="Activity" width={60} height={60} />
              </div>
              <div className="activity-details">
                <span className="activity-label">Activity</span>
                <h3 className="activity-name">JW Marriott Mussoorie With Balcony 5★</h3>
                <span className="activity-duration">2 Days & 3 Nights</span>
              </div>
              <div className="activity-status">
                <span className="added-badge">✓ ADDED</span>
              </div>
            </div>

            <div className="activity-item adding">
              <div className="activity-image">
                <Image src="/activity2.jpg" alt="Activity" width={60} height={60} />
              </div>
              <div className="activity-details">
                <span className="activity-label">Activity</span>
                <h3 className="activity-name">Universal Studios Singapore : Universal Express</h3>
                <span className="activity-duration">8 Hours</span>
              </div>
              <div className="activity-status">
                <span className="adding-badge">Adding...</span>
              </div>
            </div>

            <div className="upgrade-section">
              <span className="upgrade-text">Upgrade my Burj Khalifa |</span>
              <div className="upgrade-controls">
                <button className="upgrade-btn">-</button>
                <button className="upgrade-btn">+</button>
              </div>
            </div>
          </div>
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
          align-items: center;
          justify-content: center;
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
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .floating-cards-left {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }

        .floating-cards-right {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }

        .cards-row {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          animation: float 6s ease-in-out infinite;
        }

        .cards-row-1 {
          margin-left: -48px;
        }

        .cards-row-2 {
          margin-left: -102px;
          animation-delay: -3s;
        }

        .floating-cards-right .cards-row-1 {
          margin-right: -48px;
          justify-content: flex-end;
        }

        .floating-cards-right .cards-row-2 {
          margin-right: -102px;
          justify-content: flex-end;
        }

        .flip-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .flip-card:hover {
          transform: scale(1.05);
        }

        .flip-inner {
          width: 100%;
          height: 100%;
        }

        .flip-front {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .flip-front img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

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
          color: #f39c12;
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

        .tour-customization {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px 0;
          border-bottom: 1px solid #f1f3f4;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .activity-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .activity-details {
          flex: 1;
          text-align: left;
        }

        .activity-label {
          font-size: 12px;
          color: #7f8c8d;
          text-transform: uppercase;
          font-weight: 500;
        }

        .activity-name {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin: 5px 0;
        }

        .activity-duration {
          font-size: 14px;
          color: #7f8c8d;
        }

        .activity-status {
          flex-shrink: 0;
        }

        .added-badge {
          background: #27ae60;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .adding-badge {
          background: #f39c12;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .upgrade-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
        }

        .upgrade-text {
          font-size: 16px;
          color: #2c3e50;
        }

        .upgrade-controls {
          display: flex;
          gap: 10px;
        }

        .upgrade-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          color: #2c3e50;
        }

        .upgrade-btn:hover {
          background: #f8f9fa;
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

          .tour-customization {
            padding: 20px;
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
      `}</style>
    </div>
  )
}

export default ThrillophiliaHero