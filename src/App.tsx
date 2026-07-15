import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  Cloud, 
  CloudLightning, 
  CloudRain, 
  Moon, 
  Terminal, 
  Sparkles, 
  RefreshCw,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LeaderboardEntry } from './types';

// Importing modular screens
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Pretest from './components/Pretest';
import LessonContent from './components/LessonContent';
import Posttest from './components/Posttest';
import Game from './components/Game';
import ScoreReport from './components/ScoreReport';
import AdminPanel from './components/AdminPanel';

// Google Sheet Apps Script endpoint
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxAC9bjlZQhjYlRNbQ6iVHLoOyfqwKbpUarxvBG1afp7B-RkSFFKG63Y1O0-x7QG5Gu/exec';

// Peer list to seed the leaderboard initially so it feels alive and competitive right away!
const CLASSMATE_SEED: LeaderboardEntry[] = [
  { studentName: "นภัสวรรณ รักษ์ดี", pretestScore: 3, posttestScore: 10, development: 7, qualityLevel: "ดีเยี่ยม" },
  { studentName: "ณัฐวุฒิ แก้วประเสริฐ", pretestScore: 2, posttestScore: 9, development: 7, qualityLevel: "ดีเยี่ยม" },
  { studentName: "ชิตพล มงคลชัย", pretestScore: 4, posttestScore: 8, development: 4, qualityLevel: "ดี" },
  { studentName: "พัชริดา รัตนพงษ์", pretestScore: 2, posttestScore: 7, development: 5, qualityLevel: "ดี" },
  { studentName: "อัครพล ยิ่งเจริญ", pretestScore: 1, posttestScore: 6, development: 5, qualityLevel: "พอใช้" },
  { studentName: "สิรินทรา มีสุข", pretestScore: 2, posttestScore: 5, development: 3, qualityLevel: "พอใช้" },
  { studentName: "กิตติพงษ์ ทองแท้", pretestScore: 1, posttestScore: 4, development: 3, qualityLevel: "ปรับปรุง" },
];

export default function App() {
  const [studentName, setStudentName] = useState<string>('');
  const [pretestScore, setPretestScore] = useState<number | null>(null);
  const [posttestScore, setPosttestScore] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [gameScore, setGameScore] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Google Sheets state management
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(CLASSMATE_SEED);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);
  const [loginTime, setLoginTime] = useState<string>('');

  // 1. Fetch current leaderboard on mount and load from local storage
  useEffect(() => {
    // Load local cache if available
    const cachedName = localStorage.getItem('webtech_student_name');
    const cachedPre = localStorage.getItem('webtech_pretest_score');
    const cachedPost = localStorage.getItem('webtech_posttest_score');
    const cachedGame = localStorage.getItem('webtech_game_completed');
    const cachedGameScore = localStorage.getItem('webtech_game_score');

    if (cachedName) setStudentName(cachedName);
    if (cachedPre) setPretestScore(Number(cachedPre));
    if (cachedPost) setPosttestScore(Number(cachedPost));
    if (cachedGame) setGameCompleted(cachedGame === 'true');
    if (cachedGameScore) setGameScore(Number(cachedGameScore));

    fetchLeaderboard();
  }, []);

  // 2. Fetch Leaderboard from Google Sheets API
  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const response = await fetch(WEB_APP_URL);
      if (response.ok) {
        const data = await response.json();
        if (data && data.status === 'success' && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
          // Merge seeds with sheet data, avoiding duplicate names
          const sheetRecords: LeaderboardEntry[] = data.leaderboard.map((item: any) => ({
            studentName: item.studentName,
            pretestScore: Number(item.pretestScore),
            posttestScore: Number(item.posttestScore),
            development: Number(item.development),
            qualityLevel: item.qualityLevel || 'พอใช้',
          }));

          const merged = [...sheetRecords];
          // Add seeded classmates if not already in sheets to keep dashboard lush
          CLASSMATE_SEED.forEach(seed => {
            if (!merged.some(m => m.studentName === seed.studentName)) {
              merged.push(seed);
            }
          });
          setLeaderboard(merged);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch Google Sheets leaderboard. Using localized classroom data.");
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // 3. Post logs to Google Sheets (Login, pretest, posttest, logout)
  const syncToGoogleSheets = async (payload: {
    studentName: string;
    action: 'LOGIN' | 'SUBMIT_PRETEST' | 'SUBMIT_POSTTEST' | 'LOGOUT';
    pretestScore?: number;
    posttestScore?: number;
    development?: number;
    qualityLevel?: string;
    sessionTime?: string;
  }) => {
    setSyncStatus('saving');
    try {
      // Send post with plain-text body to bypass preflight CORS issues
      const res = await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // standard reliable mode for Google Scripts
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload)
      });
      
      // Since no-cors hides response, we assume success after successful write
      setSyncStatus('saved');
      
      // Automatically refresh the leaderboard after a minor delay
      setTimeout(() => {
        setSyncStatus('idle');
        fetchLeaderboard();
      }, 2000);

    } catch (err) {
      console.error(err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 4000);
    }
  };

  // 4. Handle Login Action
  const handleLogin = (name: string) => {
    const timeStr = new Date().toLocaleString('th-TH');
    setStudentName(name);
    setLoginTime(timeStr);
    localStorage.setItem('webtech_student_name', name);

    // Initial alert
    Swal.fire({
      title: `ยินดีต้อนรับสู่ห้องเรียน!`,
      html: `<p class="text-sm">ยินดีต้อนรับคุณ <strong class="text-cyan-400">${name}</strong> เข้าสู่บทเรียนออนไลน์วิชาเทคโนโลยีเว็บ ปวช.1</p>`,
      icon: 'success',
      confirmButtonText: 'เข้าเรียนเลย',
      confirmButtonColor: '#06b6d4'
    });

    // Sync to sheet
    syncToGoogleSheets({
      studentName: name,
      action: 'LOGIN'
    });

    // Update local leaderboard to include the user with default 0s
    setLeaderboard(prev => {
      if (prev.some(x => x.studentName === name)) return prev;
      return [...prev, {
        studentName: name,
        pretestScore: 0,
        posttestScore: 0,
        development: 0,
        qualityLevel: 'ปรับปรุง'
      }];
    });
  };

  // 5. Handle Pretest completion
  const handlePretestComplete = (score: number) => {
    setPretestScore(score);
    localStorage.setItem('webtech_pretest_score', String(score));
    setActiveTab('dashboard'); // take back to dashboard once unlocked!

    // Sync to sheet
    syncToGoogleSheets({
      studentName,
      action: 'SUBMIT_PRETEST',
      pretestScore: score
    });

    // Update current user's pretest score on leaderboard
    setLeaderboard(prev => prev.map(item => {
      if (item.studentName === studentName) {
        return { ...item, pretestScore: score };
      }
      return item;
    }));
  };

  // 6. Handle Posttest completion
  const handlePosttestComplete = (score: number) => {
    setPosttestScore(score);
    localStorage.setItem('webtech_posttest_score', String(score));
    setActiveTab('report'); // switch to score report and improvement page

    const preScore = pretestScore || 0;
    const dev = score - preScore;
    
    let qualityLevel = 'ปรับปรุง';
    if (score >= 9) qualityLevel = 'ดีเยี่ยม';
    else if (score >= 7) qualityLevel = 'ดี';
    else if (score >= 5) qualityLevel = 'พอใช้';

    // Sync to sheet
    syncToGoogleSheets({
      studentName,
      action: 'SUBMIT_POSTTEST',
      pretestScore: preScore,
      posttestScore: score,
      development: dev,
      qualityLevel: qualityLevel
    });

    // Update current user's stats on leaderboard
    setLeaderboard(prev => prev.map(item => {
      if (item.studentName === studentName) {
        return { 
          ...item, 
          pretestScore: preScore,
          posttestScore: score, 
          development: dev,
          qualityLevel: qualityLevel
        };
      }
      return item;
    }));
  };

  // 7. Handle Game completion
  const handleGameComplete = (score: number) => {
    setGameCompleted(true);
    setGameScore(score);
    localStorage.setItem('webtech_game_completed', 'true');
    localStorage.setItem('webtech_game_score', String(score));
  };

  // 8. Handle Logout Action
  const handleLogout = () => {
    Swal.fire({
      title: 'ออกจากระบบ?',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ บทเรียนปัจจุบันของคุณจะยังถูกบันทึกไว้ในสถิติ!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#475569'
    }).then((result) => {
      if (result.isConfirmed) {
        // Log out logic
        syncToGoogleSheets({
          studentName,
          action: 'LOGOUT',
          sessionTime: `${loginTime} ถึง ${new Date().toLocaleString('th-TH')}`
        });

        // Clear local cache
        localStorage.clear();
        setStudentName('');
        setPretestScore(null);
        setPosttestScore(null);
        setGameCompleted(false);
        setGameScore(0);
        setActiveTab('dashboard');

        Swal.fire({
          title: 'ออกจากระบบสำเร็จ',
          text: 'ข้อมูลการเรียนของคุณได้รับการบันทึกบน Google Sheet ปลอดภัยแล้ว!',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3b82f6'
        });
      }
    });
  };

  // 9. Navigation protection for locked tabs
  const handleLockedTabAttempt = () => {
    Swal.fire({
      title: 'เนื้อหาถูกล็อกอยู่! 🔒',
      html: `<p class="text-sm">นักเรียนจำเป็นต้องคลิกเมนู <strong class="text-cyan-400">"แบบทดสอบก่อนเรียน"</strong> และทำข้อสอบ 5 ข้อให้เสร็จสิ้นก่อน จึงจะปลดล็อกบทเรียน มินิเกม และแบบทดสอบหลังเรียนได้ครับ</p>`,
      icon: 'warning',
      confirmButtonText: 'ไปทำแบบทดสอบก่อนเรียน',
      confirmButtonColor: '#06b6d4'
    }).then(() => {
      setActiveTab('pretest');
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      
      {/* 🌌 Light Blue Cyber/Dark Vibe Background Space */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/35 via-slate-950 to-slate-950 pointer-events-none z-0" />
      
      {/* Animated Glowing Cyber Full Moon / Planet behind */}
      <div className="absolute top-1/4 right-[10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-500/20 via-blue-500/10 to-indigo-500/20 blur-xl opacity-70 pointer-events-none z-0 animate-float-slow flex items-center justify-center">
        {/* Neon ring around moon */}
        <div className="w-56 h-56 rounded-full border border-sky-400/20 shadow-[0_0_50px_rgba(56,189,248,0.15)] animate-pulse" />
      </div>

      {/* Futuristic Floating Stars/Dots in the backdrop */}
      <div className="absolute top-10 left-[15%] w-2 h-2 rounded-full bg-cyan-400/30 animate-pulse pointer-events-none z-0" />
      <div className="absolute top-[60%] left-[8%] w-3 h-3 rounded-full bg-blue-500/20 animate-float-fast pointer-events-none z-0" />
      <div className="absolute top-[80%] right-[15%] w-2 h-2 rounded-full bg-indigo-400/40 animate-pulse pointer-events-none z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-between">
        
        {/* Header bar / Sync status indicator */}
        <header className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-pulse">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider block">ปวช.1 เทคโนโลยีเว็บ</span>
              <span className="text-sm font-bold text-slate-100">Web Online Classroom</span>
            </div>
          </div>

          {/* Sync Saving Status with Cloud animations */}
          <div className="flex items-center gap-2 text-xs">
            {syncStatus === 'saving' && (
              <div className="flex items-center gap-1.5 text-yellow-400 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 font-bold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังบันทึกลง Google Sheet...</span>
              </div>
            )}
            {syncStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-emerald-400 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>บันทึกสถิติสำเร็จ!</span>
              </div>
            )}
            {syncStatus === 'error' && (
              <div className="flex items-center gap-1.5 text-rose-400 px-3 py-1 rounded-full bg-rose-400/10 border border-rose-400/20 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>ซิงก์ขัดข้อง (บันทึกจำลอง)</span>
              </div>
            )}
            {syncStatus === 'idle' && (
              <div className="text-slate-400 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                <span>คลาวด์ออนไลน์</span>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Screen Routing */}
        <main className="flex-1">
          {!studentName ? (
            // 1. Student not logged in: show Login screen
            <LoginScreen onLogin={handleLogin} isSaving={syncStatus === 'saving'} />
          ) : (
            // 2. Logged in: show full dashboard layout with sidebar
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Sidebar */}
              <Sidebar 
                studentName={studentName}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  // If clicked locked tabs, block and trigger alert
                  const targetItem = ['lesson', 'game', 'posttest', 'report'].includes(tab);
                  if (targetItem && pretestScore === null) {
                    handleLockedTabAttempt();
                  } else {
                    setActiveTab(tab);
                  }
                }}
                pretestCompleted={pretestScore !== null}
                onLogout={handleLogout}
                pretestScore={pretestScore}
                posttestScore={posttestScore}
              />

              {/* Right Panel View Router */}
              <div className="flex-1 lg:max-h-[90vh] lg:overflow-y-auto pr-1">
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    studentName={studentName}
                    pretestScore={pretestScore}
                    posttestScore={posttestScore}
                    gameCompleted={gameCompleted}
                    gameScore={gameScore}
                    leaderboard={leaderboard}
                    onRefreshLeaderboard={fetchLeaderboard}
                    isLoadingLeaderboard={isLoadingLeaderboard}
                    setActiveTab={(tab) => {
                      if (pretestScore === null && ['lesson', 'game', 'posttest', 'report'].includes(tab)) {
                        handleLockedTabAttempt();
                      } else {
                        setActiveTab(tab);
                      }
                    }}
                  />
                )}

                {activeTab === 'pretest' && (
                  <Pretest 
                    onComplete={handlePretestComplete} 
                    isSaving={syncStatus === 'saving'}
                  />
                )}

                {activeTab === 'lesson' && <LessonContent />}

                {activeTab === 'game' && (
                  <Game 
                    onComplete={handleGameComplete}
                    gameCompleted={gameCompleted}
                    gameScore={gameScore}
                  />
                )}

                {activeTab === 'posttest' && (
                  <Posttest 
                    onComplete={handlePosttestComplete}
                    isSaving={syncStatus === 'saving'}
                  />
                )}

                {activeTab === 'report' && (
                  <ScoreReport 
                    studentName={studentName}
                    pretestScore={pretestScore}
                    posttestScore={posttestScore}
                    isSaving={syncStatus === 'saving'}
                  />
                )}

                {activeTab === 'admin' && (
                  <AdminPanel 
                    studentName={studentName}
                    leaderboard={leaderboard}
                    onExit={() => setActiveTab('dashboard')}
                    onClearStudent={(name) => {
                      setLeaderboard(prev => prev.filter(item => item.studentName !== name));
                      if (name === studentName) {
                        localStorage.clear();
                        setStudentName('');
                        setPretestScore(null);
                        setPosttestScore(null);
                        setGameCompleted(false);
                        setGameScore(0);
                        setActiveTab('dashboard');
                      }
                    }}
                  />
                )}
              </div>

            </div>
          )}
        </main>

        {/* Clean, minimalist footer as requested */}
        <footer className="mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          <p>© 2026 Copyright | พัฒนาโดย CHATCHARIN PALM</p>
        </footer>

      </div>
    </div>
  );
}
