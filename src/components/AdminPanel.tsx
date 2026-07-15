import { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Search, 
  Trash2, 
  Download, 
  XCircle, 
  ShieldCheck, 
  GraduationCap, 
  FileSpreadsheet, 
  HelpCircle,
  Clock,
  ArrowLeftRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { LeaderboardEntry } from '../types';

interface AdminPanelProps {
  studentName: string;
  leaderboard: LeaderboardEntry[];
  onExit: () => void;
  onClearStudent?: (name: string) => void;
}

export default function AdminPanel({
  studentName,
  leaderboard,
  onExit,
  onClearStudent
}: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unstudied' | 'studying' | 'finished'>('all');
  const [selectedSort, setSelectedSort] = useState<'name' | 'posttest' | 'development'>('posttest');

  // Derive detailed student info and status for all active students (including seeded peers)
  const processedRoster = leaderboard.map(student => {
    const pre = student.pretestScore || 0;
    const post = student.posttestScore || 0;
    const dev = post - pre;
    
    // Status
    let statusLabel: 'unstudied' | 'studying' | 'finished' = 'studying';
    let statusText = 'กำลังเรียน';
    let statusColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';

    if (student.pretestScore === 0 && student.posttestScore === 0) {
      statusLabel = 'unstudied';
      statusText = 'ยังไม่เรียน';
      statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    } else if (student.posttestScore > 0) {
      statusLabel = 'finished';
      statusText = 'เรียนจบ';
      statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }

    return {
      ...student,
      pre,
      post,
      dev,
      statusLabel,
      statusText,
      statusColor
    };
  });

  // Calculate high-level KPIs
  const totalStudents = processedRoster.length;
  const finishedCount = processedRoster.filter(r => r.statusLabel === 'finished').length;
  const studyingCount = processedRoster.filter(r => r.statusLabel === 'studying').length;
  const unstudiedCount = processedRoster.filter(r => r.statusLabel === 'unstudied').length;
  
  // Averages for students who actually participated (i.e. took at least pretest or posttest)
  const activeStudents = processedRoster.filter(r => r.pre > 0 || r.post > 0);
  const avgPre = activeStudents.length > 0 
    ? (activeStudents.reduce((sum, r) => sum + r.pre, 0) / activeStudents.length).toFixed(1) 
    : '0.0';
  const avgPost = activeStudents.length > 0 
    ? (activeStudents.reduce((sum, r) => sum + r.post, 0) / activeStudents.length).toFixed(1) 
    : '0.0';
  const avgDev = activeStudents.length > 0 
    ? (activeStudents.reduce((sum, r) => sum + r.dev, 0) / activeStudents.length).toFixed(1) 
    : '0.0';

  // Apply filters & search queries
  const filteredRoster = processedRoster
    .filter(student => {
      const matchSearch = student.studentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = statusFilter === 'all' || student.statusLabel === statusFilter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (selectedSort === 'name') {
        return a.studentName.localeCompare(b.studentName, 'th');
      } else if (selectedSort === 'development') {
        return b.dev - a.dev;
      } else {
        return b.post - a.post; // sort by posttest default
      }
    });

  // CSV Grade Report Exporter
  const handleExportCSV = () => {
    let csvContent = '\ufeff'; // UTF-8 BOM for Thai language Excel compatibility
    csvContent += 'ลำดับ,ชื่อ-นามสกุล,คะแนนก่อนเรียน (เต็ม 5),คะแนนหลังเรียน (เต็ม 10),ค่าพัฒนาการ (Development),สถานะการเรียน,ระดับการประเมิน\n';
    
    processedRoster.forEach((student, index) => {
      csvContent += `${index + 1},"${student.studentName}",${student.pre},${student.post},${student.dev >= 0 ? '+' : ''}${student.dev},${student.statusText},"${student.qualityLevel}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Classroom_Grades_Report_ปวช1.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: 'ส่งออกรายงานเกรดสำเร็จ!',
      text: 'ดาวน์โหลดไฟล์ผลการเรียนและบันทึกคะแนนเป็น .csv เรียบร้อย',
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#06b6d4',
      background: '#0f172a',
      color: '#f8fafc'
    });
  };

  const handleResetRow = (studentName: string) => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      html: `<p class="text-xs">ต้องการรีเซ็ตผลคะแนนและสถานะของ <strong class="text-rose-400">${studentName}</strong> กลับเป็นค่าเริ่มต้นใช่หรือไม่?</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, รีเซ็ตข้อมูล',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#475569',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        if (onClearStudent) {
          onClearStudent(studentName);
          Swal.fire({
            title: 'รีเซ็ตสำเร็จ',
            text: 'ข้อมูลคะแนนได้รับการรีเซ็ตแล้ว',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#f8fafc'
          });
        }
      }
    });
  };

  return (
    <div className="space-y-8" id="admin-panel">
      {/* Admin Title Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-white">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              แผงวิเคราะห์คุณครูและผู้ดูแลระบบ
              <span className="text-[10px] bg-purple-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">Class Overview</span>
            </h2>
            <p className="text-xs text-slate-400">สถิติสรุปผลการเรียนรู้ เปรียบเทียบคะแนน และความก้าวหน้า ปวช.1 ทุกรายคน</p>
          </div>
        </div>

        <button 
          onClick={onExit}
          className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer"
        >
          ← กลับสู่หน้าหลักนักเรียน
        </button>
      </div>

      {/* Aggregate metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="admin-stats-grid">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/15 text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">นักเรียนจดทะเบียนทั้งหมด</p>
            <p className="text-xl font-black text-white">{totalStudents} คน</p>
            <p className="text-[10px] text-emerald-400 mt-0.5 font-semibold">เรียนจบ {finishedCount} | กำลังเรียน {studyingCount}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">คะแนนเฉลี่ยก่อนเรียน</p>
            <p className="text-xl font-black text-blue-400">{avgPre} <span className="text-xs text-slate-500 font-bold">/ 5</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">วัดสัมฤทธิผลตั้งต้นของผู้เรียน</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">คะแนนเฉลี่ยหลังเรียน</p>
            <p className="text-xl font-black text-emerald-400">{avgPost} <span className="text-xs text-slate-500 font-bold">/ 10</span></p>
            <p className="text-[10px] text-emerald-400 mt-0.5 font-semibold">ผ่านสัมฤทธิผลหลังจบบทเรียน</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">อัตราค่าพัฒนาการเฉลี่ย</p>
            <p className="text-xl font-black text-cyan-400">+{avgDev} <span className="text-xs text-slate-500 font-bold">แต้ม</span></p>
            <p className="text-[10px] text-cyan-400 mt-0.5 font-semibold">การเติบโตความรู้สะสมเชิงลึก</p>
          </div>
        </div>
      </div>

      {/* Classroom Dual Bar Chart visual representation using SVG layout */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-purple-400" />
            กราฟเปรียบเทียบคะแนนก่อนเรียน vs หลังเรียน (Pretest & Posttest Dual Comparison)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">แถบสีฟ้าแทนระดับคะแนนก่อนเรียน (เต็ม 5) และแถบสีเขียวเข้มแทนระดับคะแนนสอบหลังเรียนจริง (เต็ม 10)</p>
        </div>

        {/* Chart container */}
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {processedRoster.map((student, idx) => {
            const prePercent = (student.pre / 5) * 100;
            const postPercent = (student.post / 10) * 100;

            return (
              <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-200">{student.studentName}</span>
                  <div className="flex gap-4 text-[10px] font-mono">
                    <span className="text-blue-400">ก่อนเรียน: {student.pre}/5 ({Math.round(prePercent)}%)</span>
                    <span className="text-emerald-400 font-bold">หลังเรียน: {student.post}/10 ({Math.round(postPercent)}%)</span>
                  </div>
                </div>

                {/* Progress bar tracks */}
                <div className="space-y-1">
                  {/* Pretest row */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 w-12 font-bold font-mono">PRE-TEST</span>
                    <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${prePercent}%` }}
                      />
                    </div>
                  </div>
                  {/* Posttest row */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500 w-12 font-bold font-mono">POST-TEST</span>
                    <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${postPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Database Roster list */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4.5 h-4.5 text-cyan-400" />
              ตารางบันทึกผลการเรียนรู้นักศึกษาทั้งหมด ปวช.1
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">ตารางประเมินผลการเรียน ความก้าวหน้า และสถิติจำนวนคะแนนที่บันทึกลง Sheet</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* CSV export */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
              title="ดาวน์โหลดสรุปประเมินรายงานวิชาห้องเรียนทั้งหมดเป็น CSV"
            >
              <Download className="w-3.5 h-3.5" />
              ดาวน์โหลดรายงาน CSV
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              ทั้งหมด ({totalStudents})
            </button>
            <button
              onClick={() => setStatusFilter('unstudied')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'unstudied'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              ยังไม่เรียน ({unstudiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('studying')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'studying'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              กำลังเรียน ({studyingCount})
            </button>
            <button
              onClick={() => setStatusFilter('finished')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'finished'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              เรียนจบ ({finishedCount})
            </button>
          </div>

          {/* Search box & sort selector */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="พิมพ์ค้นหาชื่อนักเรียน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1.5 w-full sm:w-48 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <select
              value={selectedSort}
              onChange={(e: any) => setSelectedSort(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs py-1.5 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="posttest">เรียงตามหลังเรียนสูงสุด</option>
              <option value="development">เรียงตามพัฒนาการมากสุด</option>
              <option value="name">เรียงตามตัวอักษร ก-ฮ</option>
            </select>
          </div>
        </div>

        {/* Database Grid Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-900">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/40">
                <th className="py-3 px-4 text-center w-16">ลำดับ</th>
                <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                <th className="py-3 px-4 text-center">ก่อนเรียน (เต็ม 5)</th>
                <th className="py-3 px-4 text-center">หลังเรียน (เต็ม 10)</th>
                <th className="py-3 px-4 text-center">ค่าพัฒนาการ (Growth)</th>
                <th className="py-3 px-4 text-center">ระดับผลลัพธ์</th>
                <th className="py-3 px-4 text-center">สถานะการเรียน</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredRoster.length > 0 ? (
                filteredRoster.map((student, index) => {
                  return (
                    <tr key={index} className="hover:bg-slate-900/40 transition-all">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-white">
                        {student.studentName}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-300 font-semibold">
                        {student.pre} / 5
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-emerald-400">
                        {student.post} / 10
                      </td>
                      <td className={`py-3.5 px-4 text-center font-bold ${student.dev >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                        {student.dev >= 0 ? `+${student.dev}` : student.dev}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          student.post >= 9 ? 'bg-emerald-500/10 text-emerald-400' :
                          student.post >= 7 ? 'bg-cyan-500/10 text-cyan-400' :
                          student.post >= 5 ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {student.qualityLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${student.statusColor}`}>
                          {student.statusText}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleResetRow(student.studentName)}
                          className="p-1.5 rounded bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          title="ลบ/รีเซ็ตข้อมูลนักเรียนแถวนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-bold">
                    ไม่พบรายชื่อนักเรียนในฐานข้อมูลห้องเรียน...
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
