import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, ArrowRight, ChevronLeft, Gift } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";

export default function Screen18ScratchCard({ onComplete, onBack }) {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Draw luxury deep navy-charcoal scratch coating
    ctx.fillStyle = "#0F263E";
    ctx.fillRect(0, 0, width, height);

    // Decorative coating pattern
    ctx.strokeStyle = "#1A3A5A";
    ctx.lineWidth = 1;
    for (let i = -width; i < width * 2; i += 18) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Text on scratch surface
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scratch with finger or mouse", width / 2, height / 2 - 6);
    ctx.fillStyle = "#A5B4C4";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("Tap & rub to reveal discount", width / 2, height / 2 + 18);
  }, []);

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percent
    setScratchPercent((prev) => {
      const next = prev + 5;
      if (next >= 45 && !isScratched) {
        setIsScratched(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#132B45", "#8E7CC3", "#EADBFA", "#10b981"],
          });
        } catch {}
      }
      return next;
    });
  };

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-2 text-center"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_-12px_rgba(19,43,69,0.08)] border border-[#EADBFA] relative overflow-hidden">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#4A1766] bg-[#F4E8FC] px-3.5 py-1 rounded-full mb-3">
          <Gift className="w-3.5 h-3.5" />
          Special Reward Unlocked
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Scratch to reveal your special promo code!
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-2 leading-relaxed max-w-md mx-auto">
          We want you to start your skincare journey with an exclusive reward.
        </p>

        {/* Scratch Card Container */}
        <div className="relative mx-auto my-7 max-w-[280px] sm:max-w-[320px] h-[190px] sm:h-[200px] rounded-3xl overflow-hidden border border-[#EADBFA] shadow-lg bg-gradient-to-br from-[#F4F7FA] to-white select-none">
          {/* Revealed Voucher Underneath */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-gradient-to-tr from-[#F4F7FA] via-white to-[#F4E8FC]">
            <Gift className="w-8 h-8 text-[#4A1766] mb-1.5" />
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Personalized Voucher
            </p>
            <p className="font-serif text-3xl font-bold text-[#4A1766] mt-0.5">
              50% OFF
            </p>
            <p className="text-xs font-mono font-bold text-slate-800 bg-[#F4E8FC] px-3 py-1 rounded-full mt-2 border border-[#7A35A3]/20">
              MILC-GLOW-50
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-1">
              ✓ Applied to your order
            </p>
          </div>

          {/* HTML5 Scratch Surface Canvas */}
          <canvas
            ref={canvasRef}
            width={320}
            height={200}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-500 ${
              isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        </div>

        <p className="text-[11px] sm:text-xs text-slate-400 mb-6">
          {isScratched
            ? "✨ Voucher unlocked! Proceed to lock in your discounted pricing."
            : "Rub the card above to unveil your clinical introductory gift."}
        </p>

        <div className="mt-8 flex items-center justify-between gap-3 max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-12 border border-gray-200/90 text-gray-700 rounded-full font-semibold hover:bg-gray-50 text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <span>Back</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onComplete}
            className="flex-[1.5] h-12 bg-gradient-to-r from-[#E34234] to-[#C72F22] text-white rounded-full font-bold text-sm cursor-pointer shadow-md shadow-[#E34234]/20 hover:shadow-lg hover:shadow-[#E34234]/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Claim & View Plan</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
