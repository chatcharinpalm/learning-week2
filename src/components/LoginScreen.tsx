import React, { useState } from 'react';
import { User, BookOpen, Sparkles, Code, Terminal } from 'lucide-react';
import Swal from 'sweetalert2';

interface LoginScreenProps {
  onLogin: (name: string) => void;
  isSaving: boolean;
}

export default function LoginScreen({ onLogin, isSaving }: LoginScreenProps) {
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();
    if (!trimmed) {
      Swal.fire({
        title: 'แจ้งเตือน!',
        text: 'กรุณากรอกชื่อ-นามสกุลจริง เพื่อเข้าเรียน',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Check for both first and last name
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน!',
        text: 'กรุณากรอกทั้งชื่อ และ นามสกุล (เว้นวรรคตรงกลาง)',
        icon: 'info',
        confirmButtonText: 'รับทราบ',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    onLogin(trimmed);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8">
      {/* App Title Header card */}
      <div className="w-full max-w-lg mb-8 text-center" id="login-header-card">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3 tracking-widest shine-effect">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          ระบบการเรียนรู้ออนไลน์ระดับชั้น ปวช.1
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight mb-2">
          บทเรียนออนไลน์
        </h1>
        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          วิชาเทคโนโลยีเว็บ
        </p>
        <p className="text-sm text-blue-200/80 font-medium tracking-wide mt-1">
          หัวข้อ: เอชทีเอ็มแอล ซีเอสเอส และจาวาสคริปต์
        </p>
      </div>

      {/* Central Login Card */}
      <div 
        className="w-full max-w-md glass-panel p-8 rounded-3xl relative overflow-hidden transition-all duration-300 hover:shadow-cyan-500/10 hover:shadow-2xl"
        id="login-form-card"
      >
        {/* Glow Sweep Reflection on Card */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full rotate-45 pointer-events-none shine-effect" />

        {/* Mascot / Theme visual inside login card */}
        <div className="flex justify-center mb-6">
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 animate-float-slow">
            <div className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
              Dev Mode
            </div>
            <Terminal className="w-12 h-12 text-cyan-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-extrabold text-white">กรุณากรอกชื่อเพื่อเข้าเรียน</h2>
            <p className="text-xs text-slate-400 mt-1">ข้อมูลจะถูกบันทึกลงในทะเบียนคะแนน ปวช.1</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 tracking-wider uppercase">
              ชื่อ - นามสกุลจริง (ภาษาไทย/อังกฤษ)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <User className="w-5 h-5 text-slate-400" />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ตัวอย่าง: สมชาย ตั้งใจเรียน"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/70 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-base"
                disabled={isSaving}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold shadow-lg hover:from-cyan-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transform hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 text-lg cursor-pointer"
            id="login-btn"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังลงทะเบียนเข้าระบบ...
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                เริ่มบทเรียนออนไลน์
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            ระบบรองรับทั้งมือถือ และคอมพิวเตอร์
          </p>
        </div>
      </div>

      {/* Network / Sheets syncing status indicators at the page bottom */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/40 border border-slate-800 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Google Sheets Sync: Ready (Sheet ID: ...Tl0A)</span>
      </div>
    </div>
  );
}
