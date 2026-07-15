import { useState } from 'react';
import { 
  Search, 
  Award, 
  Flame, 
  BookOpen, 
  Gamepad2, 
  Code2, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface DashboardProps {
  studentName: string;
  pretestScore: number | null;
  posttestScore: number | null;
  gameCompleted: boolean;
  gameScore: number;
  leaderboard: LeaderboardEntry[];
  onRefreshLeaderboard: () => void;
  isLoadingLeaderboard: boolean;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({
  studentName,
  pretestScore,
  posttestScore,
  gameCompleted,
  gameScore,
  leaderboard,
  onRefreshLeaderboard,
  isLoadingLeaderboard,
  setActiveTab
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Local calculation of quality level
  const getQualityText = (score: number) => {
    if (score >= 9) return 'ดีเยี่ยม';
    if (score >= 7) return 'ดี';
    if (score >= 5) return 'พอใช้';
    return 'ปรับปรุง';
  };

  // Filter and sort the leaderboard
  // Rules: Sorted by posttestScore highest first. If tied, sort by development or name.
  const filteredLeaderboard = leaderboard
    .filter(entry => 
      entry.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.posttestScore - a.posttestScore);

  const totalProgress = [
    pretestScore !== null,
    true, // Started dashboard
    gameCompleted,
    posttestScore !== null
  ].filter(Boolean).length * 25;

  return (
    <div className="space-y-8" id="dashboard-tab">
      {/* Dynamic welcome banner with shine effect */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden text-white border border-cyan-500/20 shine-effect" id="welcome-banner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ยินดีต้อนรับสู่ห้องเรียนคอมพิวเตอร์ ปวช.1
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              สวัสดี, <span className="bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">{studentName}</span> 👋
            </h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              พร้อมที่จะผจญภัยในโลกของเว็บบอร์ดหรือยัง? มาฝึกฝนพื้นฐานสำคัญ HTML, CSS และ JavaScript เพื่อก้าวสู่การเป็นนักพัฒนาเว็บมืออาชีพกันเถอะ!
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
            <div className="text-center">
              <p className="text-2xl font-black text-cyan-400">{totalProgress}%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">ความคืบหน้า</p>
            </div>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" 
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Stat 1: Pre-test */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4 transition-all hover:translate-y-1 hover:border-blue-500/30">
          <div className="p-3.5 rounded-xl bg-blue-500/15 text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">แบบทดสอบก่อนเรียน</p>
            <p className="text-lg font-black text-white">
              {pretestScore !== null ? `${pretestScore} / 5` : 'ยังไม่ได้ทำ'}
            </p>
            <p className="text-[10px] text-blue-400 mt-0.5 font-semibold">
              {pretestScore !== null ? 'สำเร็จแล้ว' : 'ต้องทำก่อนเรียน'}
            </p>
          </div>
        </div>

        {/* Stat 2: Games */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4 transition-all hover:translate-y-1 hover:border-yellow-500/30">
          <div className="p-3.5 rounded-xl bg-yellow-500/15 text-yellow-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">เกมต่อคำศัพท์ยักษ์</p>
            <p className="text-lg font-black text-white">
              {gameCompleted ? `${gameScore} คะแนน` : 'ยังไม่ได้เล่น'}
            </p>
            <p className="text-[10px] text-yellow-400 mt-0.5 font-semibold">
              {gameCompleted ? 'ผ่านด่านจับคู่คู่หู' : 'พร้อมให้ฝึกไหวพริบ'}
            </p>
          </div>
        </div>

        {/* Stat 3: Post-test */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4 transition-all hover:translate-y-1 hover:border-violet-500/30">
          <div className="p-3.5 rounded-xl bg-violet-500/15 text-violet-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">แบบทดสอบหลังเรียน</p>
            <p className="text-lg font-black text-white">
              {posttestScore !== null ? `${posttestScore} / 10` : 'ยังไม่ได้สอบ'}
            </p>
            <p className="text-[10px] text-violet-400 mt-0.5 font-semibold">
              {posttestScore !== null ? `ระดับ: ${getQualityText(posttestScore)}` : 'เปิดให้สอบหลังจบบทเรียน'}
            </p>
          </div>
        </div>

        {/* Stat 4: Development */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4 transition-all hover:translate-y-1 hover:border-emerald-500/30">
          <div className="p-3.5 rounded-xl bg-emerald-500/15 text-emerald-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">ค่าพัฒนาการเรียนรู้</p>
            <p className="text-lg font-black text-white">
              {posttestScore !== null && pretestScore !== null 
                ? `${posttestScore - pretestScore >= 0 ? '+' : ''}${posttestScore - pretestScore}` 
                : 'รอผลหลังเรียน'}
            </p>
            <p className="text-[10px] text-emerald-400 mt-0.5 font-semibold">
              {posttestScore !== null ? 'คำนวณเปรียบเทียบเรียบร้อย' : 'สอบก่อนหลังเพื่อเทียบวัด'}
            </p>
          </div>
        </div>
      </div>

      {/* Tech Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-orange-500/15 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 font-black">
              HTML
            </div>
            <h3 className="text-lg font-bold text-white mb-2">โครงสร้างหน้าเว็บ</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              ใช้สร้างโครงร่าง วางเนื้อหา ข้อความ รูปภาพ ลิงก์ และองค์ประกอบทั้งหมดในหน้าเว็บของคุณ
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('lesson')}
            className="flex items-center gap-1.5 text-xs text-orange-400 font-bold hover:text-orange-300 mt-auto hover:translate-x-1 transition-all cursor-pointer"
          >
            ศึกษาเพิ่มเติม <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-sky-500/15 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 font-black">
              CSS
            </div>
            <h3 className="text-lg font-bold text-white mb-2">ความสวยงามและดีไซน์</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              ตกแต่งหน้าตารูปแบบ สีสัน ฟอนต์ การจัดเลย์เอาต์ และเอฟเฟกต์แอนิเมชันให้ดึงดูดสายตาผู้ใช้งาน
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('lesson')}
            className="flex items-center gap-1.5 text-xs text-sky-400 font-bold hover:text-sky-300 mt-auto hover:translate-x-1 transition-all cursor-pointer"
          >
            ศึกษาเพิ่มเติม <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-yellow-500/15 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4 font-black">
              JS
            </div>
            <h3 className="text-lg font-bold text-white mb-2">การตอบสนองแบบอัจฉริยะ</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              สร้างฟังก์ชัน คอนโทรลตรรกะ ตัวแปร การคลิกปุ่ม แจ้งเตือน เกม และระบบความฉลาดโต้ตอบแบบเรียลไทม์
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('lesson')}
            className="flex items-center gap-1.5 text-xs text-yellow-400 font-bold hover:text-yellow-300 mt-auto hover:translate-x-1 transition-all cursor-pointer"
          >
            ศึกษาเพิ่มเติม <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Leaderboard Screen at bottom */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800" id="leaderboard-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              ตารางจัดอันดับผลคะแนนระดับห้องเรียน ปวช.1
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">คะแนนอ้างอิงจากการสอบหลังเรียน (Posttest) ของเพื่อนๆ ในชั้นเรียน</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search inputs */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหารายชื่อเพื่อน..."
                className="w-full sm:w-56 pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Refresh button */}
            <button
              onClick={onRefreshLeaderboard}
              disabled={isLoadingLeaderboard}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
              title="ดึงข้อมูลจาก Google Sheets ใหม่"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingLeaderboard ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Board table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/20">
                <th className="py-3 px-4 text-center w-16">อันดับ</th>
                <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                <th className="py-3 px-4 text-center">คะแนนก่อนเรียน</th>
                <th className="py-3 px-4 text-center">คะแนนหลังเรียน (เต็ม 10)</th>
                <th className="py-3 px-4 text-center">ค่าพัฒนาการ</th>
                <th className="py-3 px-4 text-center">ผลประเมิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((entry, index) => {
                  const isCurrentUser = entry.studentName === studentName;
                  const dev = entry.posttestScore - entry.pretestScore;
                  const devFormatted = dev >= 0 ? `+${dev}` : dev;

                  // Rank colors
                  let rankBadge = '';
                  if (index === 0) rankBadge = '🥇';
                  else if (index === 1) rankBadge = '🥈';
                  else if (index === 2) rankBadge = '🥉';
                  else rankBadge = `#${index + 1}`;

                  return (
                    <tr 
                      key={index} 
                      className={`hover:bg-slate-800/30 transition-all ${
                        isCurrentUser ? 'bg-cyan-500/10 font-bold border-l-2 border-l-cyan-400' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-center text-sm font-extrabold text-white">
                        {rankBadge}
                      </td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <span className="text-slate-100 font-medium">
                          {entry.studentName}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-black animate-pulse">
                            คุณ
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center text-slate-300 font-semibold">
                        {entry.pretestScore} / 5
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-emerald-400 text-sm">
                        {entry.posttestScore} / 10
                      </td>
                      <td className={`py-4 px-4 text-center font-bold ${dev >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                        {devFormatted}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${
                          entry.posttestScore >= 9 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          entry.posttestScore >= 7 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          entry.posttestScore >= 5 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {entry.qualityLevel || getQualityText(entry.posttestScore)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    ไม่พบรายชื่อนักเรียนที่สอดคล้องกับการค้นหา...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
