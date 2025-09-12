'use client'

import React, { useRef, useEffect } from "react";

export default function GlowBorderBox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = 250;
    const height = 200;
    let angle = 0;

    function draw() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw blurred glow first
      ctx.save();
      ctx.filter = "blur(15px) brightness(1.5)";
      const glowGradient = ctx.createConicGradient(angle, width / 2, height / 2);
      glowGradient.addColorStop(0, "transparent");
      glowGradient.addColorStop(0.05, "#1976ed");
      glowGradient.addColorStop(0.15, "transparent");
      ctx.strokeStyle = glowGradient;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.roundRect(2.5, 2.5, width - 5, height - 5, 10);
      ctx.stroke();
      ctx.restore();
      
      // Draw sharp glowing border
      const sharpGradient = ctx.createConicGradient(angle, width / 2, height / 2);
      sharpGradient.addColorStop(0, "transparent");
      sharpGradient.addColorStop(0.05, "#4a9dff");
      sharpGradient.addColorStop(0.15, "transparent");
      ctx.strokeStyle = sharpGradient;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(2.5, 2.5, width - 5, height - 5, 10);
      ctx.stroke();
      
      // Draw inner box
      ctx.fillStyle = "#292a2e";
      ctx.beginPath();
      ctx.roundRect(5, 5, width - 10, height - 10, 7);
      ctx.fill();
      
      angle += 0.01;
      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-[#1D1E22]">
      <canvas ref={canvasRef} width={250} height={200} />
    </div>
  );
}