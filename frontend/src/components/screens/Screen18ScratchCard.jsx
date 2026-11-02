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

    // Draw luxury deep espresso scratch coating
    ctx.fillStyle = "#141416";
    ctx.fillRect(0, 0, width, height);

    // Decorative coating diagonal hatch
    ctx.strokeStyle = "#27272A";
    ctx.lineWidth = 1;
    for (let i = -width; i < width * 2; i += 18) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Text on scratch surface
    ctx.fillStyle = "#FAF9F6";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Rub or scratch with finger / mouse", width / 2, height / 2 - 8);
    ctx.fillStyle = "#AFA698";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Unlock your customized treatment voucher", width / 2, height / 2 + 16);
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
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    setScratchPercent((prev) => {
      const next = prev + 5;
      if (next >= 40 && !isScratched) {
        setIsScratched(true);
        try {
          confetti({
            particleCount: 55,
            spread: 65,
            origin: { y: 0.6 },
            colors: ["#CD92EB", "#D4FF3F", "#E04234", "#FFFFFF", "#141416"],
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
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md md:max-w-xl mx-auto px-3 sm:px-6 pb-12 pt-2 text-center"
    >
      <div className="atelier-card rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 relative overflow-hidden bg-white/95 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#71717A] bg-[#FAF9F6] border border-[#EBE5DC] px-3.5 py-1 rounded-full mb-3 shadow-2xs">
          <Gift className="w-3.5 h-3.5 text-[#E04234]" />
          PRIVILEGE VOUCHER · STEP 17
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#141416] leading-tight">
          Scratch to reveal your gift
        </h2>
        <p className="text-xs sm:text-sm text-[#71717A] mt-2 mb-6 max-w-md mx-auto">
          We unlocked a consultation promotion exclusive to your skin topography scan.
        </p>

        {/* Scratch Area Wrapper */}
        <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-44 sm:h-48 mx-auto rounded-3xl overflow-hidden shadow-xs border border-[#EBE5DC]">
          {/* Revealed Content Underneath */}
          <div className="absolute inset-0 bg-[#FAF9F6] p-6 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E04234] font-bold">
              Exclusive Allocation
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#141416] my-1">
              ₹300 OFF
            </div>
            <p className="text-xs text-[#52525B] font-medium">
              Applied automatically to your personalized routine protocol
            </p>
          </div>

          {/* Interactive Scratch Canvas */}
          <canvas
            ref={canvasRef}
            width={360}
            height={200}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-700 ${
              isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center justify-between gap-3 max-w-md mx-auto pt-5 border-t border-[#EBE5DC]">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="flex-1 h-12 border border-[#EBE5DC] bg-[#FAF9F6] text-[#52525B] rounded-full font-semibold hover:bg-[#F2ECE3] hover:text-[#141416] text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onComplete}
            className="flex-[1.5] h-12 bg-[#E04234] hover:bg-[#C73024] text-white rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,66,52,0.22)] hover:shadow-[0_12px_24px_-4px_rgba(224,66,52,0.3)] flex items-center justify-center gap-2 transition-all"
          >
            <span>Claim & Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
