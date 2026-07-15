import { Award, BarChart3, TrendingUp, CheckCircle, RefreshCw, Star, ShieldCheck, Printer } from 'lucide-react';
import Swal from 'sweetalert2';

interface ScoreReportProps {
  studentName: string;
  pretestScore: number | null;
  posttestScore: number | null;
  onRestartCourse?: () => void;
  isSaving: boolean;
}

export default function ScoreReport({
  studentName,
  pretestScore,
  posttestScore,
  onRestartCourse,
  isSaving
}: ScoreReportProps) {
  
  const pScore = pretestScore || 0;
  const postScore = posttestScore || 0;
  const devIndex = postScore - pScore;
  const devIndexFormatted = devIndex >= 0 ? `+${devIndex}` : `${devIndex}`;

  const getQuality = (score: number) => {
    if (score >= 9) return { text: 'ดีเยี่ยม', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: 'ยอดเยี่ยมมาก! คุณเข้าใจหลักการเทคโนโลยีเว็บอย่างถ่องแท้และพร้อมสำหรับการเขียนโค้ดขั้นสูง' };
    if (score >= 7) return { text: 'ดี', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', desc: 'ทำได้ดีมาก! มีความเข้าใจพื้นฐานที่แน่นหนา และเขียนโครงสร้างเว็บได้ถูกต้อง' };
    if (score >= 5) return { text: 'พอใช้', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', desc: 'ผ่านเกณฑ์พอใช้! มีจุดที่ต้องทบทวนเพิ่มเติม ลองเปิดดูบทเรียนซ้ำอีกครั้งจะช่วยได้มาก' };
    return { text: 'ปรับปรุง', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', desc: 'ควรปรับปรุง! อย่าเพิ่งย่อท้อนะ ลองเรียนรู้บทเรียนใหม่อีกรอบและฝึกทำโจทย์บ่อยๆ' };
  };

  const quality = getQuality(postScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8" id="report-panel">
      {/* Title */}
      <div className="flex items-center gap-2 text-white">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">รายงานประเมินคะแนนและการพัฒนาการเรียนรู้</h2>
          <p className="text-xs text-slate-400">เปรียบเทียบผลลัพธ์ของผลการทดสอบก่อนเรียนและหลังเรียนรายบุคคล</p>
        </div>
      </div>

      {/* Analytics and side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pretest score */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center text-white flex flex-col justify-between">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">คะแนนทดสอบก่อนเรียน</p>
          <div className="my-4">
            <span className="text-5xl font-black text-blue-400">{pScore}</span>
            <span className="text-slate-500 text-lg"> / 5</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 mb-4">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(pScore / 5) * 100}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            วัดความรู้ตั้งต้นขณะเข้าบทเรียนครั้งแรกโดยยังไม่เห็นเนื้อหา
          </p>
        </div>

        {/* Posttest score */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center text-white flex flex-col justify-between">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">คะแนนทดสอบหลังเรียน</p>
          <div className="my-4">
            <span className="text-5xl font-black text-emerald-400">{postScore}</span>
            <span className="text-slate-500 text-lg"> / 10</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 mb-4">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(postScore / 10) * 100}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            ผลสัมฤทธิ์ทางการเรียนรู้ที่สรุปหลังจากนักเรียนผ่านบทเรียน
          </p>
        </div>

        {/* Development metric */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-5">
            <TrendingUp className="w-24 h-24 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">ค่าพัฒนาการเรียนรู้ (Development)</p>
          <div className="my-4">
            <span className={`text-5xl font-black ${devIndex >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              {devIndexFormatted}
            </span>
            <span className="text-slate-500 text-lg"> แต้ม</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-950 text-xs font-bold w-fit mx-auto border border-slate-800">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>ดัชนีคะแนนเพิ่มพูน</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal mt-4">
            สะท้อนถึงการเติบโตและการเปิดรับทฤษฎีใหม่ที่สอนในห้องเรียน
          </p>
        </div>

      </div>

      {/* Rating & feedback bar */}
      <div className={`glass-panel p-6 rounded-3xl border flex flex-col sm:flex-row items-center gap-6 text-white ${quality.color}`}>
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center flex-shrink-0">
          <span className="text-[11px] font-black uppercase tracking-wider block text-slate-400 mb-1">ผลการประเมิน</span>
          <span className="text-2xl font-black">{quality.text}</span>
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-extrabold text-white flex items-center justify-center sm:justify-start gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-inherit" />
            วิเคราะห์พฤติกรรมการเรียนรู้สถิตินี้
          </h4>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            {quality.desc}
          </p>
        </div>
      </div>

      {/* Decorative online certificate / badge */}
      {posttestScore !== null && (
        <div 
          className="glass-panel p-8 sm:p-12 rounded-3xl text-center text-white border-2 border-yellow-500/20 relative overflow-hidden bg-gradient-to-b from-slate-950/80 to-slate-900/60 max-w-2xl mx-auto shadow-2xl"
          id="certificate-box"
        >
          {/* Certificate background embellishments */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600" />
          <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-yellow-500/5 blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-cyan-500/5 blur-2xl" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/40 flex items-center justify-center text-yellow-400 shadow-lg animate-float-slow">
                <Award className="w-8 h-8 fill-yellow-500/10" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest block">CERTIFICATE OF COMPLETION</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100">เกียรติบัตรรับรองสัมฤทธิ์ผลเรียนรู้</h3>
              <p className="text-xs text-slate-400">บทเรียนออนไลน์เทคโนโลยีเว็บ | คอมพิวเตอร์ ปวช.1</p>
            </div>

            <div className="py-4">
              <p className="text-xs text-slate-400">เกียรติบัตรฉบับนี้มอบให้เพื่อรับรองว่า</p>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white my-2 border-b border-dashed border-slate-800 pb-2 max-w-md mx-auto">
                {studentName}
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                ได้ผ่านระบบทดสอบความเข้าใจ วิชาเทคโนโลยีเว็บ เรื่อง เอชทีเอ็มแอล ซีเอสเอส และจาวาสคริปต์
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-950/60 border border-slate-900 p-4 rounded-2xl">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">ผลคะแนนรวม</p>
                <p className="text-sm font-black text-cyan-400">{postScore} / 10 คะแนน</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">ดัชนีพัฒนาการ</p>
                <p className="text-sm font-black text-emerald-400">{devIndexFormatted} คะแนนเพิ่ม</p>
              </div>
            </div>

            {/* Signature section */}
            <div className="pt-6 border-t border-slate-900 flex justify-between items-end text-left">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">ผู้รับรองสถิติ</p>
                <p className="text-xs font-bold text-slate-300">ระบบประเมินผลกลางอัตโนมัติ</p>
                <p className="text-[9px] text-slate-500">Google Sheets Connection</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-semibold">ผู้พัฒนาโครงงาน</p>
                <p className="text-xs font-bold text-yellow-500/90 font-sans tracking-wide">CHATCHARIN PALM</p>
                <p className="text-[9px] text-slate-500">© 2026 Web Lesson Project</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                สั่งพิมพ์ / บันทึก PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
