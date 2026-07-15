import { useState, useEffect } from 'react';
import { Gamepad2, Sparkles, Check, HelpCircle, RefreshCw, Star, Info } from 'lucide-react';
import Swal from 'sweetalert2';

interface GameProps {
  onComplete: (score: number) => void;
  gameCompleted: boolean;
  gameScore: number;
}

interface PairItem {
  id: string;
  code: string;
  desc: string;
}

const ALL_PAIRS: PairItem[] = [
  { id: '1', code: '<a>', desc: 'แท็ก HTML สำหรับสร้างลิงก์เชื่อมโยงหน้าเว็บ (Hyperlink)' },
  { id: '2', code: '<img>', desc: 'แท็ก HTML ใช้แสดงรูปภาพลงบนเว็บเพจ' },
  { id: '3', code: 'background-color: blue;', desc: 'คุณสมบัติ CSS สำหรับกำหนดสีพื้นหลังเป็นสีน้ำเงิน' },
  { id: '4', code: 'color: red;', desc: 'คุณสมบัติ CSS สำหรับเปลี่ยนสีของตัวอักษรเป็นสีแดง' },
  { id: '5', code: 'alert("สวัสดี ปวช.1");', desc: 'คำสั่ง JavaScript สำหรับเปิดกล่องแจ้งเตือนแบบป๊อปอัป' },
  { id: '6', code: 'let name = "Palm";', desc: 'การประกาศตัวแปรเก็บข้อมูลประเภทข้อความใน JavaScript' },
  { id: '7', code: '<h1>', desc: 'แท็ก HTML สำหรับกำหนดหัวข้อหลักขนาดใหญ่ที่สุด' },
  { id: '8', code: 'console.log("Debug");', desc: 'คำสั่ง JavaScript เขียนข้อความลงหน้าต่างวินโดว์ตรวจสอบของเบราว์เซอร์' },
];

export default function Game({ onComplete, gameCompleted, gameScore }: GameProps) {
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [activeRight, setActiveRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [leftItems, setLeftItems] = useState<{ id: string; text: string }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string; text: string }[]>([]);
  const [attempts, setAttempts] = useState(0);

  // Initialize a random game session with 4 random pairs from the pool
  const initGame = () => {
    setActiveLeft(null);
    setActiveRight(null);
    setMatchedIds([]);
    setAttempts(0);

    // Shuffle and pick 4 pairs
    const shuffledPairs = [...ALL_PAIRS].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledPairs.slice(0, 4);

    // Prepare left (code) and right (desc) lists and shuffle them separately
    const lefts = selectedPairs.map(p => ({ id: p.id, text: p.code })).sort(() => Math.random() - 0.5);
    const rights = selectedPairs.map(p => ({ id: p.id, text: p.desc })).sort(() => Math.random() - 0.5);

    setLeftItems(lefts);
    setRightItems(rights);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setActiveLeft(id);
    
    // Check if right was already selected
    if (activeRight) {
      checkMatch(id, activeRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setActiveRight(id);

    // Check if left was already selected
    if (activeLeft) {
      checkMatch(activeLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    setAttempts(prev => prev + 1);

    if (leftId === rightId) {
      // Success Match!
      const newMatched = [...matchedIds, leftId];
      setMatchedIds(newMatched);
      setActiveLeft(null);
      setActiveRight(null);

      // Trigger temporary success notification
      Swal.fire({
        toast: true,
        position: 'top-end',
        title: 'จับคู่ถูกต้อง! 🎉',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        background: '#0f172a',
        color: '#38bdf8'
      });

      // Check if all 4 matched
      if (newMatched.length === 4) {
        onComplete(10); // Give max 10 score for matching
        Swal.fire({
          title: 'ยินดีด้วย! คุณผ่านด่านกูรูโค้ด!',
          text: `คุณจับคู่คำศัพท์และโค้ด HTML/CSS/JS สำเร็จทั้งหมดภายใน ${attempts + 1} ครั้ง! รับคะแนนโบนัส 10 คะแนนเต็ม`,
          icon: 'success',
          confirmButtonText: 'ยอดเยี่ยมมาก',
          confirmButtonColor: '#eab308'
        });
      }
    } else {
      // Fail match - vibrate/shake and reset selected
      Swal.fire({
        toast: true,
        position: 'top-end',
        title: 'ยังไม่ถูกต้อง ลองอีกครั้ง ❌',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000,
        background: '#0f172a',
        color: '#f43f5e'
      });
      setTimeout(() => {
        setActiveLeft(null);
        setActiveRight(null);
      }, 500);
    }
  };

  return (
    <div className="space-y-6" id="game-panel">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400">
            <Gamepad2 className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">มินิเกมจับคู่โค้ดหรรษา (Dev Matcher)</h2>
            <p className="text-xs text-slate-400">คลิกเลือกตัวเลือกฝั่งซ้ายและฝั่งขวาที่สัมพันธ์กันให้ถูกต้อง</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            คะแนนสะสม: {gameCompleted ? '10/10 (สำเร็จแล้ว)' : '0/10'}
          </div>

          <button
            onClick={initGame}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            สุ่มโจทย์ใหม่
          </button>
        </div>
      </div>

      {/* Game Stage Area */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-yellow-500/10 relative overflow-hidden">
        {/* Glow sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full rotate-45 pointer-events-none shine-effect" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          {/* Left Column: Code Blocks */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-300 tracking-wider uppercase mb-2 text-center md:text-left flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              บล็อกตัวเลือกโค้ด (CODE SNIPPET)
            </h3>
            
            {leftItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isActive = activeLeft === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleLeftClick(item.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border text-left font-mono text-xs sm:text-sm font-bold transition-all relative overflow-hidden group ${
                    isMatched
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 cursor-not-allowed'
                      : isActive
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/40 shadow-lg scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950 hover:text-white hover:translate-x-1 cursor-pointer'
                  }`}
                  id={`game-left-${item.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.text}</span>
                    {isMatched ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-cyan-400 transition-all" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Descriptions */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-300 tracking-wider uppercase mb-2 text-center md:text-left flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              ความหมายและหน้าที่การทำงาน (DESCRIPTION)
            </h3>

            {rightItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isActive = activeRight === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleRightClick(item.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-xs leading-relaxed font-semibold transition-all relative overflow-hidden group ${
                    isMatched
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 cursor-not-allowed'
                      : isActive
                      ? 'bg-indigo-950/70 border-indigo-400 text-indigo-300 ring-2 ring-indigo-500/40 shadow-lg scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950 hover:text-white hover:-translate-x-1 cursor-pointer'
                  }`}
                  id={`game-right-${item.id}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{item.text}</span>
                    {isMatched ? (
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-indigo-400 transition-all flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Instructive Tip Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-yellow-500/80" />
            <span>คำแนะนำ: หากจับคู่ผิด พร็อพพอร์ตี้จะถูกเคลียร์ สามารถจับคู่ต่อได้ทันที</span>
          </div>

          <div className="text-right">
            จำนวนครั้งที่พยายามจับคู่: <span className="font-extrabold text-white text-sm">{attempts}</span> ครั้ง
          </div>
        </div>
      </div>
    </div>
  );
}
