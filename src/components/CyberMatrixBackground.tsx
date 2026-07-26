"use client";

import { useEffect, useRef } from "react";

export function CyberMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Matrix characters (katakana + latin + numbers)
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    const fontSize = 16;
    let columns = width / fontSize;
    const drops: number[] = [];
    
    // Initialize drops
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = width / fontSize;
      drops.length = 0;
      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      // Semi-transparent black to create trailing effect
      ctx.fillStyle = "rgba(0, 5, 10, 0.05)";
      ctx.fillRect(0, 0, width, height);

      // Neon blue/cyan color
      ctx.fillStyle = "#0ff";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Calculate distance from mouse for interaction
        const dropX = i * fontSize;
        const dropY = drops[i] * fontSize;
        const dx = dropX - mouseX;
        const dy = dropY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Slightly brighter if near mouse
        if (distance < 150) {
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#0ff";
        } else {
          ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, dropX, dropY);

        // Reset drop randomly to create stagger
        if (dropY > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
      }
      
      // Draw Grid
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(0, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      
      // Horizontal lines
      ctx.beginPath();
      for (let y = 0; y < height; y += 40) {
        // slight curve based on mouse
        const offset = (y - mouseY) * 0.05;
        ctx.moveTo(0, y + offset);
        ctx.lineTo(width, y + offset);
      }
      ctx.stroke();

      // Vertical lines
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        const offset = (x - mouseX) * 0.05;
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, height);
      }
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] bg-[#02050e]"
      style={{ filter: "contrast(1.2)" }}
    />
  );
}
