import { 
  Home, 
  ClipboardCheck, 
  BookOpen, 
  Gamepad2, 
  Award, 
  BarChart3, 
  LogOut, 
  Lock, 
  Unlock,
  User,
  GraduationCap,
  HelpCircle,
  ShieldAlert,
  Settings
} from 'lucide-react';
import Swal from 'sweetalert2';

interface SidebarProps {
  studentName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pretestCompleted: boolean;
  onLogout: () => void;
  pretestScore: number | null;
  posttestScore: number | null;
}

export default function Sidebar({
  studentName,
  activeTab,
  setActiveTab,
  pretestCompleted,
  onLogout,
  pretestScore,
  posttestScore
}: SidebarProps) {
  
  // Dynamic study status calculations
  const getStudyStatus = () => {
    if (posttestScore !== null) {
      return { 
        text: 'เรียนจบ 🟢', 
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
        badge: 'Web Ninja (ดีเยี่ยม)' 
      };
    }
    if (pretestCompleted) {
      return { 
        text: 'กำลังเรียน 🔵', 
        color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
        badge: 'กำลังศึกษาบทเรียน' 
      };
    }
    return { 
      text: 'ยังไม่เรียน 🟡', 
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badge: 'ต้องทำแบบทดสอบก่อนเรียน' 
    };
  };

  const status = getStudyStatus();

  const menuItems = [
    { id: 'dashboard', label: 'หน้าแรก / แดชบอร์ด', icon: Home, requiresPretest: false },
    { id: 'pretest', label: 'แบบทดสอบก่อนเรียน', icon: ClipboardCheck, requiresPretest: false, completed: pretestCompleted, score: pretestScore },
    { id: 'lesson', label: 'บทเรียนออนไลน์', icon: BookOpen, requiresPretest: true },
    { id: 'game', label: 'เกมประลองความรู้', icon: Gamepad2, requiresPretest: true },
    { id: 'posttest', label: 'แบบทดสอบหลังเรียน', icon: Award, requiresPretest: true, completed: posttestScore !== null, score: posttestScore },
    { id: 'report', label: 'สรุปการเรียนและการพัฒนา', icon: BarChart3, requiresPretest: true },
  ];

  const handleTabClick = (itemId: string, requiresPretest: boolean) => {
    if (requiresPretest && !pretestCompleted) {
      return;
    }
    setActiveTab(itemId);
  };

  // Help Guide Modal Handler
  const showHelpGuide = () => {
    Swal.fire({
      title: '💡 แนะนำวิธีการใช้งานบทเรียนออนไลน์',
      html: `
        <div class="text-left space-y-4 text-xs leading-relaxed text-slate-300 max-h-[60vh] overflow-y-auto pr-1 font-sans">
          <p class="font-bold text-cyan-400 text-sm mb-2 border-b border-slate-800 pb-1">วิชาเทคโนโลยีเว็บ ระดับชั้น ปวช.1</p>
          
          <div class="space-y-3">
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p class="font-extrabold text-cyan-300 mb-0.5">📌 1. ทำแบบทดสอบก่อนเรียน (Pre-test)</p>
              <p class="text-[11px] text-slate-400">ทำข้อสอบวัดระดับความรู้เดิม 5 ข้อ (เวลาข้อละ 20 วินาที) เมื่อทำสำเร็จจะปลดล็อกระบบการศึกษาอื่นๆ ทันที!</p>
            </div>
            
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p class="font-extrabold text-cyan-300 mb-0.5">📌 2. เรียนรู้ออนไลน์อย่างอิสระ (Lesson)</p>
              <p class="text-[11px] text-slate-400">รับชมวิดีโอแอนิเมชันที่ปรับระดับความเร็วและย้อนคลิปหลังได้ตามชอบ พร้อมทำคำถามชวนคิดระหว่างเรียนเพื่อรับคะแนนทบทวนทันที</p>
            </div>
            
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p class="font-extrabold text-cyan-300 mb-0.5">📌 3. ลับคมสมองกับมินิเกม (Mini Game)</p>
              <p class="text-[11px] text-slate-400">จับคู่จับกลุ่มคำนิยามกับภาษาคอมพิวเตอร์เพื่อเพิ่มทักษะความไวและจดจำเชิงปฏิบัติการ</p>
            </div>
            
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p class="font-extrabold text-cyan-300 mb-0.5">📌 4. สอบวัดผลจริงหลังเรียน (Post-test)</p>
              <p class="text-[11px] text-slate-400">ทำแบบทดสอบสรุป 10 ข้อเพื่อเทียบวัดพัฒนาการเรียนรู้ของคุณแบบเป็นทางการ</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p class="font-extrabold text-cyan-300 mb-0.5">📌 5. ดาวน์โหลดเกียรติบัตร (Certificate)</p>
              <p class="text-[11px] text-slate-400">เมื่อทำสำเร็จจะสามารถกดสั่งพิมพ์เกียรติบัตรสวยงามที่มีตราประทับและชื่อสกุลของคุณส่งครูได้ทันที!</p>
            </div>
          </div>
          
          <p class="text-[10px] text-slate-500 text-center mt-4">ระบบนี้เชื่อมต่อฐานข้อมูล Google Sheets อัตโนมัติทุกอุปกรณ์ (Cross-Platform) 🌐</p>
        </div>
      `,
      confirmButtonText: 'รับทราบและเริ่มต้นศึกษาเลย',
      confirmButtonColor: '#06b6d4',
      background: '#0f172a',
      color: '#f8fafc'
    });
  };

  // Secure Admin Password check handler
  const handleAdminLogin = () => {
    Swal.fire({
      title: 'เข้าสู่โหมดผู้ดูแลระบบ / คุณครู 🔑',
      text: 'กรุณากรอกรหัสผ่านเพื่อเรียกดูสรุปภาพรวมผลลัพธ์ของนักศึกษา ปวช.1 ทั้งหมดในระบบ',
      input: 'password',
      inputPlaceholder: 'กรอกรหัสผ่าน (รหัสทดสอบ: admin123)',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันเพื่อเปิดแผงควบคุม',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#475569',
      background: '#0f172a',
      color: '#f8fafc',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value === 'admin123') {
          Swal.fire({
            title: 'เชื่อมต่อแผงครูสำเร็จ!',
            text: 'ระบบกำลังเปลี่ยนโหมดไปยัง Classroom Analytics Overview',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          }).then(() => {
            setActiveTab('admin');
          });
        } else {
          Swal.fire({
            title: 'รหัสผ่านผิดพลาด!',
            text: 'รหัสผ่านที่คุณป้อนไม่ถูกต้อง กรุณาใช้รหัส "admin123" เพื่อทำการทดสอบระบบผู้ดูแลครับ',
            icon: 'error',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#f43f5e',
            background: '#0f172a',
            color: '#f8fafc'
          });
        }
      }
    });
  };

  return (
    <aside className="w-full lg:w-80 glass-panel lg:h-[90vh] rounded-3xl flex flex-col p-6 text-white relative border border-slate-700/50 flex-shrink-0" id="sidebar-panel">
      {/* Glow sweep */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-20 pointer-events-none rounded-3xl" />

      {/* Header Info */}
      <div className="mb-6 pb-6 border-b border-slate-800 text-center lg:text-left">
        <div className="flex items-center gap-2 justify-center lg:justify-start mb-2 text-cyan-400 font-extrabold text-sm tracking-wide">
          <GraduationCap className="w-5 h-5" />
          <span>ระดับชั้น ปวช.1 | เทคโนโลยีเว็บ</span>
        </div>
        <h2 className="text-xl font-black text-slate-100 tracking-tight leading-tight">
          เอชทีเอ็มแอล ซีเอสเอส และจาวาสคริปต์
        </h2>
      </div>

      {/* Student Profile Widget */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md">
          <User className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">ผู้เข้าเรียน</p>
          <p className="font-extrabold text-white text-sm truncate">{studentName}</p>
          <div className="mt-1 flex flex-col gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.color} font-extrabold w-fit truncate`}>
              สถานะ: {status.text}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isLocked = item.requiresPretest && !pretestCompleted;
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id, item.requiresPretest)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-950/20 font-bold scale-[1.01]'
                  : isLocked
                  ? 'opacity-40 cursor-not-allowed bg-slate-900/10 border border-transparent'
                  : 'hover:bg-slate-800/60 text-slate-300 hover:text-white hover:translate-x-1 cursor-pointer border border-transparent hover:border-slate-800'
              }`}
              disabled={false}
              id={`nav-item-${item.id}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/10' : 'bg-slate-800/40'}`}>
                  <Icon className="w-4 h-4 text-inherit" />
                </div>
                <div className="text-xs font-semibold truncate max-w-[150px] lg:max-w-none">
                  {item.label}
                  {item.score !== undefined && item.score !== null && (
                    <span className="ml-1.5 text-[10px] text-cyan-300">({item.score} ค.)</span>
                  )}
                </div>
              </div>

              <div>
                {isLocked ? (
                  <Lock className="w-3 h-3 text-slate-500" />
                ) : item.completed ? (
                  <Unlock className="w-3 h-3 text-emerald-400" />
                ) : null}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Action panel footer inside sidebar */}
      <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
        {/* Help Button */}
        <button
          onClick={showHelpGuide}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition-all font-bold cursor-pointer text-xs"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          คู่มือแนะนำการใช้งาน
        </button>

        {/* Admin Dashboard Entry button */}
        <button
          onClick={handleAdminLogin}
          className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl transition-all font-bold cursor-pointer text-xs ${
            activeTab === 'admin' 
              ? 'bg-purple-600 text-white border border-purple-500 shadow-md shadow-purple-950/40' 
              : 'bg-purple-950/20 border border-purple-500/20 text-purple-300 hover:bg-purple-950/40 hover:border-purple-500/30'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          ระบบผู้ดูแลระบบ (คุณครู)
        </button>

        {/* Logout Action */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all font-bold cursor-pointer text-xs"
          id="logout-btn"
        >
          <LogOut className="w-4 h-4" />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
