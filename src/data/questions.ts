import { Question } from '../types';

export const pretestQuestions: Question[] = [
  {
    id: 1,
    question: "HTML ย่อมาจากคำว่าอะไร?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Makeup Link",
      "Home Tool Markup Language"
    ],
    correctAnswer: "Hyper Text Markup Language"
  },
  {
    id: 2,
    question: "หากต้องการกำหนดสีพื้นหลังของหน้าเว็บเป็นสีแดงด้วย CSS ข้อใดถูกต้อง?",
    options: [
      "body { background-color: red; }",
      "body { color: red; }",
      "body { bg: red; }",
      "body { background: #red; }"
    ],
    correctAnswer: "body { background-color: red; }"
  },
  {
    id: 3,
    question: "คำสั่ง JavaScript ใดใช้สำหรับแสดงกล่องแจ้งเตือน (Popup)?",
    options: [
      "alert()",
      "msg()",
      "print()",
      "toast()"
    ],
    correctAnswer: "alert()"
  },
  {
    id: 4,
    question: "แท็ก HTML ใดใช้สำหรับสร้างลิงก์เชื่อมโยงไปยังหน้าเว็บอื่น (Hyperlink)?",
    options: [
      "<a>",
      "<link>",
      "<href>",
      "<url>"
    ],
    correctAnswer: "<a>"
  },
  {
    id: 5,
    question: "จาวาสคริปต์ (JavaScript) มีหน้าที่อะไรหลักในการพัฒนาเว็บไซต์?",
    options: [
      "เพิ่มการตอบสนองและลูกเล่นการทำงานแบบไดนามิก (Dynamic Interaction)",
      "กำหนดโครงสร้างพื้นฐานของหน้าเว็บ (Structural Skeleton)",
      "ตกแต่งหน้าตาและสีสันให้สวยงาม (Aesthetic Styling)",
      "จัดการฐานข้อมูลและเซิร์ฟเวอร์หลังบ้าน (Database Storage)"
    ],
    correctAnswer: "เพิ่มการตอบสนองและลูกเล่นการทำงานแบบไดนามิก (Dynamic Interaction)"
  }
];

export const posttestQuestions: Question[] = [
  {
    id: 1,
    question: "แท็ก HTML ใดใช้สำหรับแสดงหัวข้อที่มีขนาดใหญ่ที่สุด (Main Heading)?",
    options: [
      "<h1>",
      "<h6>",
      "<head>",
      "<header>"
    ],
    correctAnswer: "<h1>"
  },
  {
    id: 2,
    question: "สัญลักษณ์ใดในภาษา CSS ที่ใช้ระบุคลาสเพื่อตกแต่ง (Class Selector)?",
    options: [
      "เครื่องหมายจุด (.)",
      "เครื่องหมายชาร์ป (#)",
      "เครื่องหมายดอลลาร์ ($)",
      "เครื่องหมายแอต (@)"
    ],
    correctAnswer: "เครื่องหมายจุด (.)"
  },
  {
    id: 3,
    question: "การประกาศตัวแปรใน JavaScript ยุคใหม่ ข้อใดถูกต้องที่สุด?",
    options: [
      "let และ const",
      "var_new และ const_new",
      "define และ value",
      "variable และ static"
    ],
    correctAnswer: "let และ const"
  },
  {
    id: 4,
    question: "หากต้องการใส่รูปภาพในหน้าเว็บด้วย HTML ต้องเขียนโค้ดรูปแบบใดถูกต้องที่สุด?",
    options: [
      "<img src=\"image.jpg\" alt=\"description\">",
      "<image href=\"image.jpg\">",
      "<picture>image.jpg</picture>",
      "<src=\"image.jpg\">"
    ],
    correctAnswer: "<img src=\"image.jpg\" alt=\"description\">"
  },
  {
    id: 5,
    question: "ข้อใดอธิบายบทบาทและความสัมพันธ์ระหว่าง HTML, CSS และ JavaScript ได้ถูกต้องที่สุด?",
    options: [
      "HTML = โครงสร้าง, CSS = หน้าตา/สไตล์, JavaScript = พฤติกรรมการทำงาน",
      "HTML = พฤติกรรม, CSS = โครงสร้าง, JavaScript = หน้าตา/สไตล์",
      "HTML = หน้าตา/สไตล์, CSS = โครงสร้าง, JavaScript = พฤติกรรมการทำงาน",
      "HTML = โครงสร้าง, CSS = พฤติกรรมการทำงาน, JavaScript = หน้าตา/สไตล์"
    ],
    correctAnswer: "HTML = โครงสร้าง, CSS = หน้าตา/สไตล์, JavaScript = พฤติกรรมการทำงาน"
  },
  {
    id: 6,
    question: "คำสั่งใดใน JavaScript ที่ใช้เขียนข้อความแสดงผลลงใน Console ของเบราว์เซอร์สำหรับดีบั๊ก?",
    options: [
      "console.log()",
      "system.out.print()",
      "document.write()",
      "console.print()"
    ],
    correctAnswer: "console.log()"
  },
  {
    id: 7,
    question: "แท็ก HTML ใดใช้สำหรับสร้างรายการแบบไม่มีลำดับหัวข้อ (Unordered List)?",
    options: [
      "<ul>",
      "<ol>",
      "<li>",
      "<list>"
    ],
    correctAnswer: "<ul>"
  },
  {
    id: 8,
    question: "คุณสมบัติ (Property) ของ CSS ใดใช้สำหรับเปลี่ยนสีตัวอักษร?",
    options: [
      "color",
      "text-color",
      "font-color",
      "foreground-color"
    ],
    correctAnswer: "color"
  },
  {
    id: 9,
    question: "เราสามารถระบุสไตล์ CSS ภายในหน้า HTML (Internal Style Sheet) โดยเขียนใต้แท็กใด?",
    options: [
      "<style>",
      "<css>",
      "<script>",
      "<link>"
    ],
    correctAnswer: "<style>"
  },
  {
    id: 10,
    question: "ข้อใดคือรูปแบบการเขียนฟังก์ชันแบบย่อ (Arrow Function) ที่ถูกต้องของ JavaScript?",
    options: [
      "const myFunc = () => { }",
      "function => myFunc() { }",
      "arrow myFunc() { }",
      "const myFunc = function() => { }"
    ],
    correctAnswer: "const myFunc = () => { }"
  }
];
