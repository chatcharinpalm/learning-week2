import { useState, useEffect, useRef } from 'react';
import { ClipboardCheck, ArrowRight, HelpCircle, AlertTriangle, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import { pretestQuestions } from '../data/questions';

interface PretestProps {
  onComplete: (score: number) => void;
  isSaving: boolean;
}

export default function Pretest({ onComplete, isSaving }: PretestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = pretestQuestions[currentIndex];

  // Start the 20-second timer
  useEffect(() => {
    setTimeLeft(20);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleNextQuestion(true); // Auto submit current as blank
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = (isTimeout = false) => {
    // Record current answer
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

    if (currentIndex < pretestQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate score and finish
      if (timerRef.current) clearInterval(timerRef.current);
      
      let finalScore = 0;
      updatedAnswers.forEach((ans, idx) => {
        if (ans === pretestQuestions[idx].correctAnswer) {
          finalScore++;
        }
      });

      Swal.fire({
        title: 'ทำแบบทดสอบเรียบร้อย!',
        text: `คุณทำแบบทดสอบก่อนเรียนได้คะแนน ${finalScore} / 5 คะแนน คะแนนนี้จะถูกส่งไปบันทึกที่ระบบกลาง`,
        icon: 'success',
        confirmButtonText: 'บันทึกและเปิดบทเรียน',
        confirmButtonColor: '#06b6d4',
      }).then(() => {
        onComplete(finalScore);
      });
    }
  };

  // Timer width calculation
  const progressPercent = (timeLeft / 20) * 100;
  // Timer color based on urgency
  const timerColor = timeLeft > 10 ? 'bg-cyan-500 shadow-cyan-500/30' : timeLeft > 5 ? 'bg-yellow-500 shadow-yellow-500/30' : 'bg-red-500 shadow-red-500/30 animate-pulse';

  return (
    <div className="max-w-2xl mx-auto" id="pretest-panel">
      {/* Quiz Progress header */}
      <div className="flex items-center justify-between mb-4 text-white">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">แบบทดสอบก่อนเรียน (Pre-test)</h2>
            <p className="text-xs text-slate-400">วัดความรู้ก่อนเริ่มเนื้อหาบทเรียน</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">ความก้าวหน้า</span>
          <p className="text-sm font-black text-cyan-400">{currentIndex + 1} / {pretestQuestions.length} ข้อ</p>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="glass-panel p-4 rounded-2xl mb-6 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
          <Clock className={`w-4.5 h-4.5 ${timeLeft <= 5 ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`} />
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

      {/* Question Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden text-white shadow-xl">
        {/* Shine Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full rotate-45 pointer-events-none shine-effect" />

        <div className="flex items-start gap-4 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold flex-shrink-0 text-sm">
            Q{currentQuestion.id}
          </div>
          <h3 className="text-lg sm:text-xl font-bold leading-relaxed pt-1">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options list */}
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
                    ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-400/80 text-white shadow-lg shadow-cyan-950/30 scale-[1.01]'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-950/80'
                }`}
                disabled={isSaving}
              >
                <div className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                  isSelected 
                    ? 'bg-cyan-400 text-slate-950' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200'
                }`}>
                  {prefix}
                </div>
                <span className="text-sm font-semibold">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom controls */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <AlertTriangle className="w-4 h-4 text-yellow-500/80" />
            ห้ามกดข้ามหรือออกจากระบบขณะทำแบบทดสอบ
          </div>

          <button
            onClick={() => handleNextQuestion(false)}
            disabled={!selectedOption || isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold flex items-center gap-2 hover:from-cyan-400 hover:to-blue-400 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {currentIndex === pretestQuestions.length - 1 ? 'ส่งคำตอบทั้งหมด' : 'ถัดไป'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
