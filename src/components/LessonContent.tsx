import { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Globe, 
  Cpu, 
  Play, 
  Pause,
  RotateCcw, 
  RotateCw, 
  Gauge, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  FileCode, 
  Volume2,
  VolumeX,
  Tv,
  CheckCircle,
  XCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

export default function LessonContent() {
  const [activeTab, setActiveTab] = useState(1);

  // Custom Video Player 1 (Lesson 1) States
  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [playbackSpeed1, setPlaybackSpeed1] = useState(1.0);
  const [volume1, setVolume1] = useState(1.0);
  const [isMuted1, setIsMuted1] = useState(false);
  const [currentTime1, setCurrentTime1] = useState(0);
  const [duration1, setDuration1] = useState(0);

  // Custom Video Player 2 (Lesson 2) States
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [playbackSpeed2, setPlaybackSpeed2] = useState(1.0);
  const [volume2, setVolume2] = useState(1.0);
  const [isMuted2, setIsMuted2] = useState(false);
  const [currentTime2, setCurrentTime2] = useState(0);
  const [duration2, setDuration2] = useState(0);

  // Interactive Question 1 States
  const [selectedAns1, setSelectedAns1] = useState<number | null>(null);
  const [isSubmitted1, setIsSubmitted1] = useState(false);
  const [isCorrect1, setIsCorrect1] = useState(false);

  // Interactive Question 2 States
  const [selectedAns2, setSelectedAns2] = useState<number | null>(null);
  const [isSubmitted2, setIsSubmitted2] = useState(false);
  const [isCorrect2, setIsCorrect2] = useState(false);

  // Sync video time updates
  const handleTimeUpdate = (videoNum: number) => {
    const video = videoNum === 1 ? videoRef1.current : videoRef2.current;
    if (video) {
      if (videoNum === 1) {
        setCurrentTime1(video.currentTime);
      } else {
        setCurrentTime2(video.currentTime);
      }
    }
  };

  const handleLoadedMetadata = (videoNum: number) => {
    const video = videoNum === 1 ? videoRef1.current : videoRef2.current;
    if (video) {
      if (videoNum === 1) {
        setDuration1(video.duration);
      } else {
        setDuration2(video.duration);
      }
    }
  };

  // Video Controls Helper functions
  const togglePlay = (videoNum: number) => {
    const video = videoNum === 1 ? videoRef1.current : videoRef2.current;
    if (video) {
      if (video.paused) {
        video.play();
        if (videoNum === 1) setIsPlaying1(true);
        else setIsPlaying2(true);
      } else {
        video.pause();
        if (videoNum === 1) setIsPlaying1(false);
        else setIsPlaying2(false);
      }
    }
  };

  const seek = (videoNum: number, seconds: number) => {
    const video = videoNum === 1 ? videoRef1.current : videoRef2.current;
    if (video) {
      video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    }
  };

  const changeSpeed = (videoNum: number, speed: number) => {
    const video = videoNum === 1 ? videoRef1.current : videoRef2.current;
    if (video) {
      video.playbackRate = speed;
      if (videoNum === 1) setPlaybackSpeed1(speed);
      else setPlaybackSpeed2(speed);
    }
  };

  const toggleMute = (videoNum: number) => {
    const video = videoNum === 1 ? videoRef1.current : videoRef2.current;
    if (video) {
      video.muted = !video.muted;
      if (videoNum === 1) setIsMuted1(video.muted);
      else setIsMuted2(video.muted);
    }
  };

  const handleVolumeChange = (videoNum: number, value: number) => {
    const video = videoNum === 1 ? videoRef1.current : videoRef2.current;
    if (video) {
      video.volume = value;
      video.muted = value === 0;
      if (videoNum === 1) {
        setVolume1(value);
        setIsMuted1(value === 0);
      } else {
        setVolume2(value);
        setIsMuted2(value === 0);
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleScrubberChange = (videoNum: number, value: number) => {
    const video = videoNum === 1 ? videoRef1.current : videoRef2.current;
    if (video) {
      video.currentTime = value;
      if (videoNum === 1) setCurrentTime1(value);
      else setCurrentTime2(value);
    }
  };

  return (
    <div className="space-y-6" id="lesson-panel">
      {/* Title */}
      <div className="flex items-center gap-2 text-white">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">ห้องเรียนออนไลน์ วิชาเทคโนโลยีเว็บ</h2>
          <p className="text-xs text-slate-400">เรียนรู้ได้ด้วยตนเองพร้อมสื่อมัลติมีเดียที่ปรับระดับและควบคุมได้ตามความสะดวก</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab(1)}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 1
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
          id="lesson-tab-1"
        >
          <Globe className="w-4.5 h-4.5" />
          <span>บทเรียนที่ 1: ความหมายของเว็บไซต์</span>
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 2
              ? 'border-indigo-400 text-indigo-400 bg-indigo-500/5 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
          }`}
          id="lesson-tab-2"
        >
          <Cpu className="w-4.5 h-4.5" />
          <span>บทเรียนที่ 2: หลักการทำงานของเว็บไซต์</span>
        </button>
      </div>

      {/* Tab 1 content */}
      {activeTab === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="lesson-tab1-content">
          {/* Theory & Questions on Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/10 relative overflow-hidden text-white shine-effect">
              <h3 className="text-lg font-black text-cyan-300 flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5" />
                เว็บไซต์ (Website) คืออะไร?
              </h3>
              
              <div className="space-y-4 text-sm leading-relaxed text-slate-200">
                <p>
                  <strong>เว็บไซต์ (Website)</strong> คือ แหล่งรวมของหน้าเว็บเพจ (Web Page) หลายๆ หน้าที่เขียนด้วยภาษาคอมพิวเตอร์และเชื่อมโยงเข้าด้วยกันผ่านระบบ <strong>ไฮเปอร์ลิงก์ (Hyperlink)</strong> เพื่อให้สามารถคลิกเดินทางสลับหน้าไปมาได้อย่างอิสระ โดยถูกจัดเก็บไว้ในเครื่องคอมพิวเตอร์แม่ข่าย (Web Server) ที่เปิดให้บริการทั่วโลกตลอด 24 ชั่วโมง
                </p>
                
                <p>
                  เราสามารถเข้าถึงเว็บไซต์ได้ผ่านเครือข่ายอินเทอร์เน็ต โดยระบุสิ่งที่เราเรียกว่า <strong>โดเมนเนม (Domain Name)</strong> เช่น <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-cyan-400">google.com</code> หรือ <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-cyan-400">wikipedia.org</code> ในเบราว์เซอร์
                </p>

                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 mt-4">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block mb-1 font-mono">💡 เปรียบเทียบเพื่อให้เข้าใจง่าย</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ให้น้องๆ ลองจินตนาการว่า <strong className="text-cyan-300">เว็บไซต์</strong> เปรียบเสมือน <span className="text-white font-bold">"หนังสือเล่มหนึ่ง"</span><br />
                    ส่วน <strong>เว็บเพจ (Web Page)</strong> แต่ละหน้าก็คือ <span className="text-white font-bold">"หน้ากระดาษหนังสือแต่ละหน้า"</span><br />
                    และ <strong>โฮมเพจ (Home Page)</strong> ก็คือ <span className="text-white font-bold">"หน้าปกและสารบัญของหนังสือเล่มนั้น"</span> นั่นเอง!
                  </p>
                </div>
              </div>
            </div>

            {/* Components card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-white">
              <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-indigo-400" />
                3 ส่วนประกอบหลักที่ต้องรู้จัก
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center hover:border-slate-700 transition-all">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-2 font-black text-xs font-mono">01</div>
                  <h5 className="font-bold text-xs text-white mb-1">Homepage (โฮมเพจ)</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">หน้าแรกของเว็บ ทำหน้าที่ต้อนรับผู้ใช้งานและเชื่อมโยงไปยังส่วนอื่น</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center hover:border-slate-700 transition-all">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2 font-black text-xs font-mono">02</div>
                  <h5 className="font-bold text-xs text-white mb-1">Webpage (เว็บเพจ)</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">หน้าข้อมูลย่อยแต่ละหน้า มีทั้งข้อความ รูปภาพ วิดีโอ และฟอร์มโต้ตอบ</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center hover:border-slate-700 transition-all">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto mb-2 font-black text-xs font-mono">03</div>
                  <h5 className="font-bold text-xs text-white mb-1">Hyperlink (ลิงก์)</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">จุดเชื่อมโยงระหว่างหน้าเว็บ โดยเมื่อนำเมาส์ไปชี้จะเป็นสัญลักษณ์รูปมือ</p>
                </div>
              </div>
            </div>

            {/* Interactive Section: กิจกรรมระหว่างเรียน / คำถามชวนคิด */}
            <div className="glass-panel p-6 rounded-3xl border-2 border-dashed border-cyan-500/20 text-white relative overflow-hidden bg-slate-950/30">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <QuestionIcon className="w-16 h-16 text-cyan-400" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1 px-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">กิจกรรมระหว่างเรียน</span>
                <h4 className="text-sm font-bold text-slate-200">คำถามชวนคิดประจำบทเรียนที่ 1</h4>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-bold text-white">
                  คำถาม: "หากเปรียบเทียบเว็บไซต์เป็น 'บ้านหนึ่งหลัง' หน้าเว็บเพจย่อย (Web Page) จะเปรียบเสมือนส่วนใดของบ้าน?"
                </p>

                <div className="space-y-2">
                  {[
                    { id: 1, text: "โครงสร้างหลักหรือรั้วรอบบ้านภายนอก" },
                    { id: 2, text: "ห้องแต่ละห้องภายในบ้าน (ห้องครัว ห้องนอน ห้องรับแขก) ที่เปิดเชื่อมโยงกัน" },
                    { id: 3, text: "กุญแจสำหรับใช้ไขเปิดเข้าประตูรั้วบ้านใหญ่" },
                    { id: 4, text: "ที่อยู่บ้านเลขที่ของบ้าน" }
                  ].map((option) => {
                    const isSelected = selectedAns1 === option.id;
                    return (
                      <button
                        key={option.id}
                        disabled={isSubmitted1}
                        onClick={() => setSelectedAns1(option.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-3 ${
                          isSubmitted1 && option.id === 2
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                            : isSubmitted1 && isSelected && option.id !== 2
                            ? 'bg-red-500/10 border-red-500 text-red-300'
                            : isSelected
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                          isSubmitted1 && option.id === 2
                            ? 'bg-emerald-500 text-slate-950'
                            : isSubmitted1 && isSelected && option.id !== 2
                            ? 'bg-red-500 text-slate-950'
                            : isSelected
                            ? 'bg-cyan-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {option.id === 1 ? 'ก' : option.id === 2 ? 'ข' : option.id === 3 ? 'ค' : 'ง'}
                        </div>
                        <span>{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                {!isSubmitted1 ? (
                  <button
                    disabled={selectedAns1 === null}
                    onClick={() => {
                      setIsSubmitted1(true);
                      setIsCorrect1(selectedAns1 === 2);
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow hover:from-cyan-400 transition-all cursor-pointer disabled:opacity-40"
                  >
                    ส่งคำตอบกิจกรรม
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {isCorrect1 ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> เก่งมาก! ตอบถูกครับ 🎉
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> ยังไม่ถูกน้า ลองดูคำเฉลยข้างล่างได้เลยครับ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-cyan-300">เฉลยข้อนีคือ ข:</strong> เพราะเว็บไซต์คือบ้านทั้งหลัง โฮมเพจคือประตูหน้าบ้าน (ทางเข้าหลัก) ส่วนเว็บเพจแต่ละหน้าก็เปรียบดั่งห้องแต่ละห้องภายในบ้านนั่นเอง ที่เปิดทะลุกันได้ด้วยประตูและลิงก์!
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted1(false);
                        setSelectedAns1(null);
                      }}
                      className="text-[10px] text-cyan-400 underline cursor-pointer hover:text-cyan-300"
                    >
                      ทำกิจกรรมข้อนี้ใหม่อีกครั้ง
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom video Player on Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-white relative">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wider mb-3">
                <Tv className="w-3.5 h-3.5" />
                สื่อมัลติมีเดีย (ควบคุมความเร็ว & ย้อนกลับได้)
              </span>
              <h4 className="text-base font-bold text-white mb-2">บทเรียนวีดิโอแอนิเมชัน</h4>
              <p className="text-xs text-slate-400 mb-4">นักเรียนสามารถเลื่อนปรับความเร็ว ย้อนคลิปหลัง หรือเพิ่มเสียงได้ตามสะดวกผ่านปุ่มควบคุมอัจฉริยะด้านล่าง</p>

              {/* Responsive custom Video Player */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-inner group">
                <video
                  ref={videoRef1}
                  onTimeUpdate={() => handleTimeUpdate(1)}
                  onLoadedMetadata={() => handleLoadedMetadata(1)}
                  onClick={() => togglePlay(1)}
                  className="w-full h-full cursor-pointer object-cover"
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                />
                
                {/* Custom Overlay Pause button */}
                {!isPlaying1 && (
                  <div 
                    onClick={() => togglePlay(1)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                  >
                    <div className="p-4 rounded-full bg-cyan-500 text-slate-950 shadow-lg scale-110 hover:scale-125 transition-all">
                      <Play className="w-8 h-8 fill-slate-950" />
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar Scrubber */}
              <div className="mt-4 space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration1 || 100}
                  value={currentTime1}
                  onChange={(e) => handleScrubberChange(1, Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{formatTime(currentTime1)}</span>
                  <span>{formatTime(duration1)}</span>
                </div>
              </div>

              {/* Custom Controller Buttons Panel */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-900 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Rewind 10s */}
                    <button
                      onClick={() => seek(1, -10)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer text-xs"
                      title="ย้อนหลัง 10 วินาที"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Play / Pause Toggle */}
                    <button
                      onClick={() => togglePlay(1)}
                      className="p-2 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 font-bold transition-all cursor-pointer text-xs flex items-center gap-1"
                    >
                      {isPlaying1 ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                      <span>{isPlaying1 ? 'หยุดชั่วคราว' : 'เล่นต่อ'}</span>
                    </button>

                    {/* Forward 10s */}
                    <button
                      onClick={() => seek(1, 10)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-all cursor-pointer text-xs"
                      title="ไปข้างหน้า 10 วินาที"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Volume Control widget */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleMute(1)}
                      className="text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      {isMuted1 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted1 ? 0 : volume1}
                      onChange={(e) => handleVolumeChange(1, Number(e.target.value))}
                      className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>

                {/* Speed Controls Grid */}
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-mono uppercase tracking-wider">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    ความเร็วเล่น:
                  </span>
                  <div className="flex gap-1">
                    {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => changeSpeed(1, speed)}
                        className={`px-2 py-1 rounded text-[10px] font-extrabold cursor-pointer font-mono ${
                          playbackSpeed1 === speed
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed === 1.0 ? 'ปกติ' : `${speed}x`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Reference Embed */}
              <div className="pt-6 mt-6 border-t border-slate-900">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-bold block w-fit mb-2">ลิงก์วิดีโอเสริมความรู้ YouTube</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  นักเรียนยังสามารถสลับไปดูผ่าน <a href="https://youtu.be/leihudXxqAY" target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-bold underline hover:text-cyan-300">คลิปแอนิเมชันความรู้ความหมายของเว็บไซต์หลัก</a> ร่วมด้วยเพื่อเสริมจินตนาการเพิ่มเติมได้เลยครับ
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 content */}
      {activeTab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="lesson-tab2-content">
          {/* Theory & Questions on Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/10 relative overflow-hidden text-white shine-effect">
              <h3 className="text-lg font-black text-indigo-300 flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5" />
                หลักการทำงานของเว็บไซต์
              </h3>
              
              <div className="space-y-4 text-sm leading-relaxed text-slate-200">
                <p>
                  เว็บไซต์ทำงานอยู่บนหลักการที่เรียกว่า <strong>Client-Server Architecture</strong> (สถาปัตยกรรมแบบผู้ใช้บริการ และผู้ให้บริการ) ซึ่งเป็นการประสานงานกันระหว่างอุปกรณ์ของคุณและเครื่องคอมพิวเตอร์ที่จัดเก็บโค้ด
                </p>

                <div className="space-y-3 pl-2 border-l-2 border-indigo-500/40">
                  <p>
                    <strong className="text-indigo-400">1. การส่งความต้องการ (Request):</strong> เมื่อนักเรียนพิมพ์ <code className="bg-slate-950 px-1 py-0.5 rounded font-mono text-cyan-400">google.com</code> ในเว็บเบราว์เซอร์ เบราว์เซอร์จะรับหน้าที่เป็น <strong>Client</strong> ค้นหาที่อยู่ไอพี (IP Address) ผ่านระบบ DNS และส่งคำขอผ่านอินเทอร์เน็ตไปหาเครื่องเซิร์ฟเวอร์
                  </p>
                  <p>
                    <strong className="text-indigo-400">2. การประมวลผลเซิร์ฟเวอร์ (Process):</strong> เครื่องคอมพิวเตอร์แม่ข่ายหลัก หรือ <strong>Web Server</strong> จะทำการประมวลผลค้นหาไฟล์ตามที่เราต้องการ และดึงเนื้อหาที่ระบุไว้
                  </p>
                  <p>
                    <strong className="text-indigo-400">3. การส่งผลตอบกลับ (Response):</strong> เซิร์ฟเวอร์จะทำการส่งข้อมูล ซึ่งมักประกอบด้วยกลุ่มไฟล์รหัสคำสั่ง <strong>HTML, CSS, JavaScript</strong> กลับคืนมาหาเบราว์เซอร์ของคุณ
                  </p>
                  <p>
                    <strong className="text-indigo-400">4. การแสดงผล (Rendering):</strong> เว็บเบราว์เซอร์ของคุณ (Client) จะนำโค้ดที่ได้มาประมวลผลแปลงร่างเป็นภาพ ตาราง สีสัน และตัวอักษรสวยงามที่เห็นบนหน้าจอเว็บ
                  </p>
                </div>
              </div>
            </div>

            {/* Stack card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-white">
              <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <FileCode className="w-4.5 h-4.5 text-cyan-400" />
                หน้าที่สำคัญของ HTML + CSS + JS ในการประมวลผลฝั่งผู้ใช้ (Client Side)
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <p className="font-extrabold text-orange-400 mb-1 font-mono uppercase tracking-wider">HTML</p>
                  <p className="text-slate-300 leading-relaxed text-[11px]">เป็นแกนโครงสร้างหลัก เปรียบเสมือนอิฐ หิน ปูน ทราย ในการสร้างบ้าน</p>
                </div>
                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <p className="font-extrabold text-sky-400 mb-1 font-mono uppercase tracking-wider">CSS</p>
                  <p className="text-slate-300 leading-relaxed text-[11px]">เป็นส่วนตกแต่งสไตล์ความสวยงาม วอลเปเปอร์ ทาสี เฟอร์นิเจอร์</p>
                </div>
                <div className="p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="font-extrabold text-yellow-400 mb-1 font-mono uppercase tracking-wider">JavaScript</p>
                  <p className="text-slate-300 leading-relaxed text-[11px]">ระบบอัตโนมัติ ก๊อกเซนเซอร์ อัจฉริยะ ลิฟต์ และไฟฟ้าส่องสว่าง</p>
                </div>
              </div>
            </div>

            {/* Interactive Section: กิจกรรมระหว่างเรียน / คำถามชวนคิด */}
            <div className="glass-panel p-6 rounded-3xl border-2 border-dashed border-indigo-500/20 text-white relative overflow-hidden bg-slate-950/30">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <QuestionIcon className="w-16 h-16 text-indigo-400" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1 px-2.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold font-mono">กิจกรรมระหว่างเรียน</span>
                <h4 className="text-sm font-bold text-slate-200">คำถามชวนคิดประจำบทเรียนที่ 2</h4>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-bold text-white">
                  คำถาม: "เมื่อนักเรียนกดปุ่ม 'สั่งพิมพ์เกียรติบัตร' โค้ดที่ประมวลผลการจัดหน้าตาตัวฟอนต์เป็นหน้าที่รับผิดชอบของส่วนใด?"
                </p>

                <div className="space-y-2">
                  {[
                    { id: 1, text: "HTML (การกำหนดโครงร่างเนื้อหาข้อความ)" },
                    { id: 2, text: "CSS (การกำหนดรูปร่าง สีสัน ฟอนต์ และการจัดระยะขอบพิมพ์)" },
                    { id: 3, text: "DNS Server (การแปลงโดเมนเนมเป็นเลขไอพี)" },
                    { id: 4, text: "Web Server (การคำนวณฐานข้อมูลหลังบ้าน)" }
                  ].map((option) => {
                    const isSelected = selectedAns2 === option.id;
                    return (
                      <button
                        key={option.id}
                        disabled={isSubmitted2}
                        onClick={() => setSelectedAns2(option.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-3 ${
                          isSubmitted2 && option.id === 2
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                            : isSubmitted2 && isSelected && option.id !== 2
                            ? 'bg-red-500/10 border-red-500 text-red-300'
                            : isSelected
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                          isSubmitted2 && option.id === 2
                            ? 'bg-emerald-500 text-slate-950'
                            : isSubmitted2 && isSelected && option.id !== 2
                            ? 'bg-red-500 text-slate-950'
                            : isSelected
                            ? 'bg-indigo-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {option.id === 1 ? 'ก' : option.id === 2 ? 'ข' : option.id === 3 ? 'ค' : 'ง'}
                        </div>
                        <span>{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                {!isSubmitted2 ? (
                  <button
                    disabled={selectedAns2 === null}
                    onClick={() => {
                      setIsSubmitted2(true);
                      setIsCorrect2(selectedAns2 === 2);
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold shadow hover:from-indigo-400 transition-all cursor-pointer disabled:opacity-40"
                  >
                    ส่งคำตอบกิจกรรม
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {isCorrect2 ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> เก่งมาก! คุณตอบถูกครับ 🎉
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> เก่งมากที่พยายาม แต่คำตอบยังไม่ใช่ครับ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-indigo-300">เฉลยข้อนีคือ ข:</strong> CSS คือผู้รับผิดชอบหลักในเรื่องการตกแต่ง ความสวยงาม ฟอนต์ สีสัน ระยะพิกเซล และสไตล์สำหรับการพิมพ์หน้าจอ (Print Media CSS)
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted2(false);
                        setSelectedAns2(null);
                      }}
                      className="text-[10px] text-indigo-400 underline cursor-pointer hover:text-indigo-300"
                    >
                      ทำกิจกรรมข้อนี้ใหม่อีกครั้ง
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom video Player on Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-white relative">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wider mb-3">
                <Tv className="w-3.5 h-3.5" />
                สื่อมัลติมีเดีย (ควบคุมความเร็ว & ย้อนกลับได้)
              </span>
              <h4 className="text-base font-bold text-white mb-2">บทเรียนวีดิโอแอนิเมชัน</h4>
              <p className="text-xs text-slate-400 mb-4">นักเรียนสามารถเลื่อนปรับความเร็ว ย้อนคลิปหลัง หรือเพิ่มเสียงได้ตามสะดวกผ่านปุ่มควบคุมอัจฉริยะด้านล่าง</p>

              {/* Responsive custom Video Player */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-inner group">
                <video
                  ref={videoRef2}
                  onTimeUpdate={() => handleTimeUpdate(2)}
                  onLoadedMetadata={() => handleLoadedMetadata(2)}
                  onClick={() => togglePlay(2)}
                  className="w-full h-full cursor-pointer object-cover"
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                />
                
                {/* Custom Overlay Pause button */}
                {!isPlaying2 && (
                  <div 
                    onClick={() => togglePlay(2)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                  >
                    <div className="p-4 rounded-full bg-indigo-500 text-slate-950 shadow-lg scale-110 hover:scale-125 transition-all">
                      <Play className="w-8 h-8 fill-slate-950" />
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar Scrubber */}
              <div className="mt-4 space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration2 || 100}
                  value={currentTime2}
                  onChange={(e) => handleScrubberChange(2, Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{formatTime(currentTime2)}</span>
                  <span>{formatTime(duration2)}</span>
                </div>
              </div>

              {/* Custom Controller Buttons Panel */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-900 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Rewind 10s */}
                    <button
                      onClick={() => seek(2, -10)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 transition-all cursor-pointer text-xs"
                      title="ย้อนหลัง 10 วินาที"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Play / Pause Toggle */}
                    <button
                      onClick={() => togglePlay(2)}
                      className="p-2 rounded-xl bg-indigo-400 text-slate-950 hover:bg-indigo-300 font-bold transition-all cursor-pointer text-xs flex items-center gap-1"
                    >
                      {isPlaying2 ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                      <span>{isPlaying2 ? 'หยุดชั่วคราว' : 'เล่นต่อ'}</span>
                    </button>

                    {/* Forward 10s */}
                    <button
                      onClick={() => seek(2, 10)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 transition-all cursor-pointer text-xs"
                      title="ไปข้างหน้า 10 วินาที"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Volume Control widget */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleMute(2)}
                      className="text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      {isMuted2 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted2 ? 0 : volume2}
                      onChange={(e) => handleVolumeChange(2, Number(e.target.value))}
                      className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                  </div>
                </div>

                {/* Speed Controls Grid */}
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-mono uppercase tracking-wider">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                    ความเร็วเล่น:
                  </span>
                  <div className="flex gap-1">
                    {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => changeSpeed(2, speed)}
                        className={`px-2 py-1 rounded text-[10px] font-extrabold cursor-pointer font-mono ${
                          playbackSpeed2 === speed
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-slate-900 border border-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed === 1.0 ? 'ปกติ' : `${speed}x`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Reference Embed */}
              <div className="pt-6 mt-6 border-t border-slate-900">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-bold block w-fit mb-2">ลิงก์วิดีโอเสริมความรู้ YouTube</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  นักเรียนยังสามารถสลับไปดูผ่าน <a href="https://youtu.be/jyEVgFQ1Lg8" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-bold underline hover:text-indigo-300">คลิปแอนิเมชันความรู้กลไกเบื้องหลังของเว็บไซต์หลัก</a> ร่วมด้วยเพื่อเสริมจินตนาการเพิ่มเติมได้เลยครับ
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
