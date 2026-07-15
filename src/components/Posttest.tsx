import { useState, useEffect, useRef } from 'react';
import { Award, ArrowRight, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import { posttestQuestions } from '../data/questions';
import { Question } from '../types';

interface PosttestProps {
  onComplete: (score: number) => void;
  isSaving: boolean;
}

// Utility to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Posttest({ onComplete, isSaving }: PosttestProps) {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffle question options once on mount
  useEffect(() => {
    const prepared = posttestQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setShuffledQuestions(prepared);
  }, []);

  // Timer runner
  useEffect(() => {
    if (shuffledQuestions.length === 0) return;

    setTimeLeft(20);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleNextQuestion(true); // auto blank
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, shuffledQuestions]);

  if (shuffledQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">กำลังสลับสับเปลี่ยนตัวเลือกคำถาม...</p>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = (isTimeout = false) => {
    const answer = isTimeout ? "" : selectedOption || "";
    const updatedAnswers = [...userAnswers, answer];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (isTimeout) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        title: 'หมดเวลา!',
        text: 'ข้ามไปข้อถัดไปโดยอัตโนมัติ',
        icon: 'warning',
        showConfirmButton: false,
        timer: 1500,
        background: '#1e293b',
        color: '#f8fafc'
      });
    }

    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final score
      if (timerRef.current) clearInterval(timerRef.current);

      let finalScore = 0;
      updatedAnswers.forEach((ans, idx) => {
        if (ans === shuffledQuestions[idx].correctAnswer) {
          finalScore++;
        }
      });

      // Celebration or motivation SwAlert
      let ratingText = '';
      let ratingIcon: 'success' | 'info' | 'warning' = 'info';
      if (finalScore >= 9) {
        ratingText = 'สุดยอดมากๆ ระดับดีเยี่ยม! คุณเป็นอัจฉริยะด้านเว็บ!';
        ratingIcon = 'success';
      } else if (finalScore >= 7) {
        ratingText = 'ทำได้ดีมาก ระดับดี! พัฒนาได้รวดเร็ว!';
        ratingIcon = 'success';
      } else if (finalScore >= 5) {
        ratingText = 'ผ่านเกณฑ์พอใช้! ทบทวนบทเรียนเพิ่มเติมจะดียิ่งขึ้น!';
        ratingIcon = 'info';
      } else {
        ratingText = 'ระดับปรับปรุง! สู้ต่อไปนะ ลองย้อนดูบทเรียนเพื่อทำความเข้าใจใหม่!';
        ratingIcon = 'warning';
      }

      Swal.fire({
        title: 'สอบหลังเรียนสำเร็จ!',
        html: `<p class="text-base text-slate-300">คุณสอบได้คะแนน <span class="text-xl font-black text-cyan-400">${finalScore} / 10</span> คะแนน</p><p class="text-xs text-slate-400 mt-2">${ratingText}</p>`,
        icon: ratingIcon,
        confirmButtonText: 'ดูผลการเรียนและการพัฒนาการ',
        confirmButtonColor: '#4f46e5',
      }).then(() => {
        onComplete(finalScore);
      });
    }
  };

  const progressPercent = (timeLeft / 20) * 100;
  const timerColor = timeLeft > 10 ? 'bg-indigo-500 shadow-indigo-500/30' : timeLeft > 5 ? 'bg-amber-500 shadow-amber-500/30' : 'bg-red-500 shadow-red-500/30 animate-pulse';

  return (
    <div className="max-w-2xl mx-auto" id="posttest-panel">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between mb-4 text-white">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">แบบทดสอบหลังเรียน (Post-test)</h2>
            <p className="text-xs text-slate-400">วัดความรู้หลังจบบทเรียนและวัดคะแนนพัฒนาการ</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">ความก้าวหน้า</span>
          <p className="text-sm font-black text-indigo-400">{currentIndex + 1} / {shuffledQuestions.length} ข้อ</p>
        </div>
      </div>

      {/* Timer Progress */}
      <div className="glass-panel p-4 rounded-2xl mb-6 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
          <Clock className={`w-4.5 h-4.5 ${timeLeft <= 5 ? 'text-red-400 animate-bounce' : 'text-indigo-400'}`} />
          เวลาคงเหลือต่อข้อ:
        </div>
        <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden relative">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${timerColor} shadow-md`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-sm font-black text-white w-8 text-right">
          {timeLeft}s
        </div>
      </div>

      {/* Question Box */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden text-white shadow-xl">
        {/* Glow Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full rotate-45 pointer-events-none shine-effect" />

        <div className="flex items-start gap-4 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-extrabold flex-shrink-0 text-sm">
            Q{currentIndex + 1}
          </div>
          <h3 className="text-lg sm:text-xl font-bold leading-relaxed pt-1">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Shuffled Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const prefix = idx === 0 ? 'ก' : idx === 1 ? 'ข' : idx === 2 ? 'ค' : 'ง';

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 cursor-pointer group ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-950/80 to-blue-950/80 border-indigo-400/80 text-white shadow-lg shadow-indigo-950/30 scale-[1.01]'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-950/80'
                }`}
                disabled={isSaving}
              >
                <div className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                  isSelected 
                    ? 'bg-indigo-400 text-slate-950' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200'
                }`}>
                  {prefix}
                </div>
                <span className="text-sm font-semibold">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertTriangle className="w-4 h-4 text-rose-500/80" />
            ตัวเลือกคำถามชุดนี้สลับลำดับจากสถิติจริง
          </div>

          <button
            onClick={() => handleNextQuestion(false)}
            disabled={!selectedOption || isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-extrabold flex items-center gap-2 hover:from-indigo-400 hover:to-blue-500 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {currentIndex === shuffledQuestions.length - 1 ? 'ส่งข้อสอบท้ายบท' : 'ถัดไป'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
