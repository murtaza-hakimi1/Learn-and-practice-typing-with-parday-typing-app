export type Language = "en" | "fa";
export type Lesson = {
  id: number;
  title: string;
  titleFa: string;
  category: string;
  categoryFa: string;
  level: string;
  levelFa: string;
  targetWpm: number;
  targetAccuracy: number;
  text: string;
  textFa: string;
};

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Warm-up basics",
    titleFa: "تمرین ابتدایی",
    category: "Basics",
    categoryFa: "ابتدایی",
    level: "Beginner",
    levelFa: "مبتدی",
    targetWpm: 10,
    targetAccuracy: 85,
    text: "A calm start helps you build a strong typing habit. Keep your hands relaxed, look at the screen, and let each finger find its key. Accuracy matters more than speed when you are learning.",
    textFa:
      "شروع آرام به شما کمک می‌کند عادت تایپ خوبی بسازید. دست‌های خود را راحت نگه دارید، به صفحه نگاه کنید و اجازه دهید هر انگشت کلید خود را پیدا کند. هنگام یادگیری، دقت از سرعت مهم‌تر است.",
  },
  {
    id: 2,
    title: "Everyday words",
    titleFa: "واژه‌های روزمره",
    category: "Words",
    categoryFa: "واژه‌ها",
    level: "Beginner",
    levelFa: "مبتدی",
    targetWpm: 15,
    targetAccuracy: 88,
    text: "Practice a little every day and your confidence will grow. Use a steady rhythm instead of rushing through every sentence. Small improvements become big results when you repeat them consistently.",
    textFa:
      "هر روز کمی تمرین کنید تا اعتماد به نفس شما بیشتر شود. به جای عجله کردن، ریتمی یکنواخت داشته باشید. پیشرفت‌های کوچک وقتی پیوسته تکرار شوند، به نتیجه‌های بزرگ تبدیل می‌شوند.",
  },
  {
    id: 3,
    title: "Punctuation practice",
    titleFa: "تمرین نشانه‌گذاری",
    category: "Accuracy",
    categoryFa: "دقت",
    level: "Beginner",
    levelFa: "مبتدی",
    targetWpm: 18,
    targetAccuracy: 90,
    text: "Good writing uses commas, periods, and question marks. Can you type this sentence carefully? Take your time, notice each symbol, and remember that clean work is useful work.",
    textFa:
      "نوشتن خوب از ویرگول، نقطه و علامت سؤال استفاده می‌کند. آیا می‌توانید این جمله را با دقت تایپ کنید؟ وقت بگذارید، هر نشانه را ببینید و به یاد داشته باشید که کار دقیق، کار مفید است.",
  },
  {
    id: 4,
    title: "Work and productivity",
    titleFa: "کار و بهره‌وری",
    category: "Productivity",
    categoryFa: "بهره‌وری",
    level: "Intermediate",
    levelFa: "متوسط",
    targetWpm: 22,
    targetAccuracy: 90,
    text: "A productive workday starts with a clear plan. Organize your tasks, take short breaks, and focus on one important thing at a time. Better typing helps you communicate ideas with less friction.",
    textFa:
      "یک روز کاری پربازده با برنامه‌ای روشن آغاز می‌شود. کارهای خود را تنظیم کنید، استراحت کوتاه داشته باشید و هر بار روی یک کار مهم تمرکز کنید. تایپ بهتر کمک می‌کند ایده‌های خود را آسان‌تر بیان کنید.",
  },
  {
    id: 5,
    title: "Technology and code",
    titleFa: "تکنالوژی و کدنویسی",
    category: "Technology",
    categoryFa: "تکنالوژی",
    level: "Intermediate",
    levelFa: "متوسط",
    targetWpm: 25,
    targetAccuracy: 92,
    text: "Software is built through problem solving, testing, and teamwork. A developer reads carefully, writes clear code, and improves the product one small step at a time. Consistency makes difficult skills easier.",
    textFa:
      "نرم‌افزار از راه حل مسئله، آزمایش و کار گروهی ساخته می‌شود. توسعه‌دهنده با دقت می‌خواند، کد روشن می‌نویسد و محصول را گام‌به‌گام بهتر می‌کند. پیوستگی مهارت‌های دشوار را آسان‌تر می‌سازد.",
  },
  {
    id: 6,
    title: "فارسی روان",
    titleFa: "فارسی روان",
    category: "Persian",
    categoryFa: "فارسی",
    level: "Intermediate",
    levelFa: "متوسط",
    targetWpm: 15,
    targetAccuracy: 90,
    text: "تمرین منظم باعث افزایش سرعت و دقت تایپ می‌شود. هنگام نوشتن آرام باشید، به متن توجه کنید و تلاش کنید هر جمله را درست و کامل تایپ کنید. پیشرفت با تمرین پیوسته به دست می‌آید.",
    textFa:
      "تمرین منظم باعث افزایش سرعت و دقت تایپ می‌شود. هنگام نوشتن آرام باشید، به متن توجه کنید و تلاش کنید هر جمله را درست و کامل تایپ کنید. پیشرفت با تمرین پیوسته به دست می‌آید.",
  },
  {
    id: 7,
    title: "Long-form focus",
    titleFa: "تمرکز در متن بلند",
    category: "Focus",
    categoryFa: "تمرکز",
    level: "Advanced",
    levelFa: "پیشرفته",
    targetWpm: 30,
    targetAccuracy: 94,
    text: "Focused practice is more valuable than endless repetition without a goal. Choose a realistic target, measure your progress, and learn from every mistake. Over time, good technique becomes a natural part of your work.",
    textFa:
      "تمرین هدفمند از تکرار بی‌پایان بدون هدف ارزشمندتر است. هدفی واقعی انتخاب کنید، پیشرفت خود را بسنجید و از هر اشتباه بیاموزید. با گذشت زمان، روش درست بخشی طبیعی از کار شما می‌شود.",
  },
  {
    id: 8,
    title: "Final speed challenge",
    titleFa: "چالش نهایی سرعت",
    category: "Challenge",
    categoryFa: "چالش",
    level: "Advanced",
    levelFa: "پیشرفته",
    targetWpm: 35,
    targetAccuracy: 95,
    text: "The best typists combine speed with control. Stay relaxed, keep your eyes on the text, and avoid correcting mistakes before you understand them. Every focused session is another step toward your personal best.",
    textFa:
      "تایپیست‌های خوب سرعت را با کنترل ترکیب می‌کنند. آرام بمانید، چشم خود را روی متن نگه دارید و پیش از شناخت اشتباه‌ها عجله نکنید. هر جلسه تمرین متمرکز، گامی به سوی بهترین نتیجه شما است.",
  },
];

export const randomPracticeTexts: Record<Language, string[]> = {
  en: [
    "Clear thinking and steady practice can turn a difficult task into a familiar skill. Start small, stay curious, and celebrate every improvement.",
    "Technology connects people, ideas, and opportunities. Learn one useful thing today and use it to make tomorrow a little easier.",
    "A good habit is built through simple actions repeated with patience. Focus on progress, not perfection, and keep moving forward.",
  ],
  fa: [
    "یادگیری با تمرین منظم و هدف روشن آسان‌تر می‌شود. آرام شروع کنید، از اشتباه‌ها بیاموزید و هر پیشرفت کوچک را ارزشمند بدانید.",
    "تکنالوژی مردم و ایده‌ها را به هم وصل می‌کند. امروز یک چیز مفید یاد بگیرید و از آن برای بهتر ساختن فردا استفاده کنید.",
    "عادت خوب با کارهای ساده و تکرار پیوسته ساخته می‌شود. روی پیشرفت تمرکز کنید، نه کامل بودن، و به راه خود ادامه دهید.",
  ],
};
