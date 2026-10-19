import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CircleHelp,
  Clock3,
  Flame,
  Gauge,
  Keyboard,
  Languages,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import {
  lessons,
  randomPracticeTexts,
  type Language,
  type Lesson,
} from "./data";
import { useTypingTest, type TestResult } from "./hooks/useTypingTest";

type SavedResult = TestResult & {
  lessonId: number;
  language: Language;
  lessonTitle: string;
};
type AppStats = {
  completedTests: number;
  bestWpm: number;
  bestAccuracy: number;
  unlockedLessons: number[];
  history: SavedResult[];
  streak: number;
  lastPracticeDate: string | null;
  totalMinutes: number;
};

const defaultStats: AppStats = {
  completedTests: 0,
  bestWpm: 0,
  bestAccuracy: 0,
  unlockedLessons: [1],
  history: [],
  streak: 0,
  lastPracticeDate: null,
  totalMinutes: 0,
};

function loadStats(): AppStats {
  try {
    const raw = localStorage.getItem("parday-typing-stats-v1");
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw) as Partial<AppStats>;
    return {
      ...defaultStats,
      ...parsed,
      unlockedLessons:
        Array.isArray(parsed.unlockedLessons) && parsed.unlockedLessons.length
          ? parsed.unlockedLessons
          : [1],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return defaultStats;
  }
}

const translations = {
  en: {
    subtitle: "Build your rhythm. Measure your progress.",
    practice: "Practice",
    progress: "Your progress",
    lessons: "Lessons",
    achievements: "Achievements",
    level: "LEVEL",
    locked: "Locked",
    unlocked: "Unlocked",
    start: "Start typing to begin",
    placeholder: "Click here and start typing the text above…",
    duration: "Test duration",
    seconds: "seconds",
    reset: "Restart test",
    random: "Random text",
    target: "Lesson target",
    wpm: "WPM",
    accuracy: "Accuracy",
    errors: "Errors",
    timeLeft: "Time left",
    complete: "Test complete!",
    tryAgain: "Try again",
    nextLesson: "Next lesson",
    lessonPassed: "Lesson passed — the next lesson is unlocked.",
    lessonNotPassed: "Keep practicing to reach the lesson target.",
    bestSpeed: "Best speed",
    testsDone: "Tests completed",
    avgAccuracy: "Best accuracy",
    minutes: "Minutes practiced",
    streak: "Day streak",
    recent: "Recent sessions",
    noHistory: "Your completed tests will appear here.",
    achievementsTitle: "Achievements",
    firstTest: "First steps",
    firstTestDesc: "Complete your first typing test.",
    speed25: "Speed builder",
    speed25Desc: "Reach 25 WPM in a test.",
    accuracy95: "Precision pro",
    accuracy95Desc: "Reach 95% accuracy.",
    streak3: "Consistent learner",
    streak3Desc: "Practice on 3 different days.",
    allLessons: "Course finisher",
    allLessonsDesc: "Unlock all 8 lessons.",
    completed: "Completed",
    notYet: "Not yet",
    keyboardTip: "Tip: accuracy first, speed follows.",
    chooseLesson: "Choose a lesson",
    current: "Current lesson",
    select: "Select lesson",
    home: "Home",
    language: "Language",
    english: "English",
    persian: "فارسی",
    welcome: "Type faster. Work smarter.",
    hero: "A focused, friendly typing studio for building speed and accuracy.",
    ready: "Ready when you are",
    dashboard: "Your typing dashboard",
    viewLessons: "View lessons",
    goal: "Goal",
    chars: "Characters",
    words: "Words",
    goodJob: "Nice work!",
    keepGoing: "Every session makes a difference.",
    lockedHint: "Pass the previous lesson to unlock this one.",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    footer: "Made for steady progress.",
    passed: "PASSED",
    need: "TARGET",
    noErrors: "No errors — excellent control!",
    progressLabel: "Course progress",
    best: "Personal best",
    clear: "Your progress is saved on this device.",
  },
  fa: {
    subtitle: "ریتم خود را بسازید و پیشرفت خود را اندازه بگیرید.",
    practice: "تمرین",
    progress: "پیشرفت شما",
    lessons: "درس‌ها",
    achievements: "دستاوردها",
    level: "سطح",
    locked: "قفل",
    unlocked: "باز",
    start: "برای شروع تایپ کنید",
    placeholder: "اینجا کلیک کنید و متن بالا را تایپ کنید…",
    duration: "مدت آزمون",
    seconds: "ثانیه",
    reset: "شروع دوباره",
    random: "متن تصادفی",
    target: "هدف درس",
    wpm: "کلمه/دقیقه",
    accuracy: "دقت",
    errors: "اشتباه‌ها",
    timeLeft: "زمان باقی",
    complete: "آزمون تمام شد!",
    tryAgain: "دوباره تلاش کنید",
    nextLesson: "درس بعدی",
    lessonPassed: "درس موفقانه تکمیل شد؛ درس بعدی باز شد.",
    lessonNotPassed: "برای رسیدن به هدف درس، بیشتر تمرین کنید.",
    bestSpeed: "بهترین سرعت",
    testsDone: "آزمون‌های تکمیل‌شده",
    avgAccuracy: "بهترین دقت",
    minutes: "دقیقه تمرین",
    streak: "روز پیوسته",
    recent: "جلسه‌های اخیر",
    noHistory: "آزمون‌های تکمیل‌شده شما اینجا نمایش داده می‌شوند.",
    achievementsTitle: "دستاوردها",
    firstTest: "گام نخست",
    firstTestDesc: "اولین آزمون تایپ خود را تکمیل کنید.",
    speed25: "سازنده سرعت",
    speed25Desc: "در یک آزمون به ۲۵ کلمه در دقیقه برسید.",
    accuracy95: "استاد دقت",
    accuracy95Desc: "به دقت ۹۵ درصد برسید.",
    streak3: "یادگیرنده پیوسته",
    streak3Desc: "در سه روز متفاوت تمرین کنید.",
    allLessons: "پایان‌دهنده دوره",
    allLessonsDesc: "هر هشت درس را باز کنید.",
    completed: "تکمیل‌شده",
    notYet: "هنوز نه",
    keyboardTip: "نکته: اول دقت، سپس سرعت.",
    chooseLesson: "یک درس انتخاب کنید",
    current: "درس فعلی",
    select: "انتخاب درس",
    home: "خانه",
    language: "زبان",
    english: "English",
    persian: "فارسی",
    welcome: "سریع‌تر تایپ کنید. هوشمندانه‌تر کار کنید.",
    hero: "محیطی ساده برای افزایش سرعت و دقت تایپ.",
    ready: "هر وقت آماده بودید",
    dashboard: "داشبورد تایپ شما",
    viewLessons: "دیدن درس‌ها",
    goal: "هدف",
    chars: "حرف",
    words: "کلمه",
    goodJob: "آفرین!",
    keepGoing: "هر جلسه تمرین تفاوت ایجاد می‌کند.",
    lockedHint: "برای باز کردن این درس، درس قبلی را موفقانه بگذرانید.",
    darkMode: "حالت تاریک",
    lightMode: "حالت روشن",
    footer: "برای پیشرفت پیوسته ساخته شده است.",
    passed: "موفق",
    need: "هدف",
    noErrors: "بدون اشتباه؛ عالی است!",
    progressLabel: "پیشرفت دوره",
    best: "بهترین نتیجه",
    clear: "پیشرفت شما روی همین دستگاه ذخیره می‌شود.",
  },
};

function formatDate(date: string, lang: Language) {
  try {
    return new Intl.DateTimeFormat(lang === "fa" ? "fa-AF" : "en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return new Date(date).toLocaleDateString();
  }
}

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [dark, setDark] = useState(true);
  const [duration, setDuration] = useState(60);
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [randomMode, setRandomMode] = useState(false);
  const [randomIndex, setRandomIndex] = useState(0);
  const [stats, setStats] = useState<AppStats>(loadStats);
  const [activeTab, setActiveTab] = useState<
    "practice" | "progress" | "achievements"
  >("practice");

  const t = translations[language];
  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const text = randomMode
    ? randomPracticeTexts[language][
        randomIndex % randomPracticeTexts[language].length
      ]
    : language === "fa"
      ? selectedLesson.textFa
      : selectedLesson.text;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem("parday-typing-stats-v1", JSON.stringify(stats));
    } catch {
      /* storage may be disabled */
    }
  }, [stats]);

  const handleFinish = useCallback(
    (result: TestResult) => {
      const today = new Date().toISOString().slice(0, 10);
      setStats((previous) => {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().slice(0, 10);
        const streak =
          previous.lastPracticeDate === today
            ? previous.streak
            : previous.lastPracticeDate === yesterday
              ? previous.streak + 1
              : 1;
        const passed =
          result.wpm >= selectedLesson.targetWpm &&
          result.accuracy >= selectedLesson.targetAccuracy;
        const unlocked = new Set(previous.unlockedLessons);
        if (passed && selectedLesson.id < lessons.length)
          unlocked.add(selectedLesson.id + 1);
        const entry: SavedResult = {
          ...result,
          lessonId: selectedLesson.id,
          language,
          lessonTitle:
            language === "fa" ? selectedLesson.titleFa : selectedLesson.title,
        };
        return {
          completedTests: previous.completedTests + 1,
          bestWpm: Math.max(previous.bestWpm, result.wpm),
          bestAccuracy: Math.max(previous.bestAccuracy, result.accuracy),
          unlockedLessons: [...unlocked].sort((a, b) => a - b),
          history: [entry, ...previous.history].slice(0, 12),
          streak,
          lastPracticeDate: today,
          totalMinutes:
            previous.totalMinutes +
            Math.max(1, Math.round(result.elapsedSeconds / 60)),
        };
      });
    },
    [language, selectedLesson],
  );

  const test = useTypingTest({ text, duration, onFinish: handleFinish });
  const lessonPassed = Boolean(
    test.result &&
    test.result.wpm >= selectedLesson.targetWpm &&
    test.result.accuracy >= selectedLesson.targetAccuracy,
  );
  const coursePercent = Math.round(
    (stats.unlockedLessons.length / lessons.length) * 100,
  );
  const wordsTyped = Math.round(
    (test.result?.correctChars ?? test.value.length) / 5,
  );
  const achievementList = useMemo(
    () => [
      {
        id: "first",
        icon: Keyboard,
        title: t.firstTest,
        desc: t.firstTestDesc,
        done: stats.completedTests >= 1,
      },
      {
        id: "speed",
        icon: Zap,
        title: t.speed25,
        desc: t.speed25Desc,
        done: stats.bestWpm >= 25,
      },
      {
        id: "accuracy",
        icon: Target,
        title: t.accuracy95,
        desc: t.accuracy95Desc,
        done: stats.bestAccuracy >= 95,
      },
      {
        id: "streak",
        icon: Flame,
        title: t.streak3,
        desc: t.streak3Desc,
        done: stats.streak >= 3,
      },
      {
        id: "course",
        icon: Trophy,
        title: t.allLessons,
        desc: t.allLessonsDesc,
        done: stats.unlockedLessons.length >= lessons.length,
      },
    ],
    [stats, t],
  );

  const switchLesson = (lesson: Lesson) => {
    if (!stats.unlockedLessons.includes(lesson.id)) return;
    setSelectedLessonId(lesson.id);
    setRandomMode(false);
    test.reset(language === "fa" ? lesson.textFa : lesson.text, duration);
  };

  const switchLanguage = (next: Language) => {
    setLanguage(next);
    setRandomMode(false);
    test.reset(
      next === "fa" ? selectedLesson.textFa : selectedLesson.text,
      duration,
    );
  };

  const changeDuration = (nextDuration: number) => {
    setDuration(nextDuration);
    test.reset(text, nextDuration);
  };

  const startRandom = () => {
    const nextIndex = (randomIndex + 1) % randomPracticeTexts[language].length;
    setRandomIndex(nextIndex);
    setRandomMode(true);
    test.reset(randomPracticeTexts[language][nextIndex], duration);
  };

  const resetCurrent = () => test.reset(text, duration);
  const goNextLesson = () => {
    const next = lessons.find((lesson) => lesson.id === selectedLessonId + 1);
    if (next && stats.unlockedLessons.includes(next.id)) switchLesson(next);
  };

  const renderPassage = () => {
    const chars = Array.from(text);
    const typed = Array.from(test.value);
    return chars.map((char, index) => {
      let className = "char";
      if (index < typed.length)
        className += typed[index] === char ? " correct" : " incorrect";
      else if (index === typed.length && !test.finished) className += " cursor";
      return (
        <span className={className} key={`${index}-${char}`}>
          {char === " " ? "\u00a0" : char}
        </span>
      );
    });
  };

  return (
    <div className={`app-shell ${dark ? "theme-dark" : "theme-light"}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            setActiveTab("practice");
          }}
        >
          <span className="brand-mark">
            <Keyboard size={21} />
          </span>
          <span>
            <strong>
              Parday<span className="brand-accent">Typing</span>
            </strong>
            <small>TYPE FASTER. WORK SMARTER.</small>
          </span>
        </a>
        <nav className="desktop-nav">
          <button
            className={
              activeTab === "practice" ? "nav-link active" : "nav-link"
            }
            onClick={() => setActiveTab("practice")}
          >
            <Keyboard size={16} /> {t.practice}
          </button>
          <button
            className={
              activeTab === "progress" ? "nav-link active" : "nav-link"
            }
            onClick={() => setActiveTab("progress")}
          >
            <Activity size={16} /> {t.progress}
          </button>
          <button
            className={
              activeTab === "achievements" ? "nav-link active" : "nav-link"
            }
            onClick={() => setActiveTab("achievements")}
          >
            <Award size={16} /> {t.achievements}
          </button>
        </nav>
        <div className="top-actions">
          <button
            className="icon-button"
            aria-label={t.language}
            title={t.language}
            onClick={() => switchLanguage(language === "en" ? "fa" : "en")}
          >
            <Languages size={18} />
            <span>{language === "en" ? "FA" : "EN"}</span>
          </button>
          <button
            className="icon-button"
            aria-label={dark ? t.lightMode : t.darkMode}
            title={dark ? t.lightMode : t.darkMode}
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === "practice" && (
            <motion.div
              key="practice"
              className="page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <section className="hero-row">
                <div className="hero-copy">
                  <div className="eyebrow">
                    <Sparkles size={14} /> {t.ready}
                  </div>
                  <h1>{t.welcome}</h1>
                  <p>{t.hero}</p>
                </div>
                <div className="hero-mini-card">
                  <div className="mini-icon">
                    <Flame size={20} />
                  </div>
                  <div>
                    <strong>
                      {stats.streak} {t.streak}
                    </strong>
                    <span>{t.keepGoing}</span>
                  </div>
                  <div className="mini-spark">
                    <Activity size={25} />
                  </div>
                </div>
              </section>

              <section className="stat-grid">
                <StatCard
                  icon={<Gauge />}
                  label={t.bestSpeed}
                  value={stats.bestWpm}
                  unit={t.wpm}
                  accent="purple"
                />
                <StatCard
                  icon={<Target />}
                  label={t.avgAccuracy}
                  value={`${stats.bestAccuracy}%`}
                  accent="blue"
                />
                <StatCard
                  icon={<BookOpen />}
                  label={t.testsDone}
                  value={stats.completedTests}
                  accent="pink"
                />
                <StatCard
                  icon={<Clock3 />}
                  label={t.minutes}
                  value={stats.totalMinutes}
                  unit="min"
                  accent="green"
                />
              </section>

              <div className="practice-layout">
                <aside className="lesson-panel glass-panel">
                  <div className="panel-heading">
                    <div>
                      <span className="section-kicker">{t.lessons}</span>
                      <h2>{t.chooseLesson}</h2>
                    </div>
                    <span className="count-pill">
                      {stats.unlockedLessons.length}/{lessons.length}
                    </span>
                  </div>
                  <div className="course-progress">
                    <div className="progress-label">
                      <span>{t.progressLabel}</span>
                      <strong>{coursePercent}%</strong>
                    </div>
                    <div className="progress-track">
                      <span style={{ width: `${coursePercent}%` }} />
                    </div>
                  </div>
                  <div className="lesson-list">
                    {lessons.map((lesson) => {
                      const unlocked = stats.unlockedLessons.includes(
                        lesson.id,
                      );
                      const selected =
                        selectedLessonId === lesson.id && !randomMode;
                      const passed = stats.history.some(
                        (item) =>
                          item.lessonId === lesson.id &&
                          item.wpm >= lesson.targetWpm &&
                          item.accuracy >= lesson.targetAccuracy,
                      );
                      return (
                        <button
                          key={lesson.id}
                          className={`lesson-item ${selected ? "selected" : ""} ${!unlocked ? "locked" : ""}`}
                          onClick={() => switchLesson(lesson)}
                          disabled={!unlocked}
                        >
                          <span
                            className={`lesson-number ${passed ? "passed" : ""}`}
                          >
                            {passed ? (
                              <Check size={15} />
                            ) : unlocked ? (
                              String(lesson.id).padStart(2, "0")
                            ) : (
                              <span className="lock-dot">•</span>
                            )}
                          </span>
                          <span className="lesson-info">
                            <strong>
                              {language === "fa"
                                ? lesson.titleFa
                                : lesson.title}
                            </strong>
                            <small>
                              {language === "fa"
                                ? lesson.levelFa
                                : lesson.level}{" "}
                              ·{" "}
                              {language === "fa"
                                ? lesson.categoryFa
                                : lesson.category}
                            </small>
                          </span>
                          {selected && <span className="selected-dot" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="sidebar-tip">
                    <CircleHelp size={17} />
                    <span>{t.lockedHint}</span>
                  </div>
                </aside>

                <section className="typing-column">
                  <div className="typing-topline">
                    <div>
                      <span className="section-kicker">
                        {randomMode
                          ? t.random
                          : `${t.level} ${selectedLesson.id}`}
                      </span>
                      <h2>
                        {randomMode
                          ? t.random
                          : language === "fa"
                            ? selectedLesson.titleFa
                            : selectedLesson.title}
                      </h2>
                    </div>
                    <div className="duration-control">
                      <span>{t.duration}</span>
                      <div className="segmented">
                        <button
                          className={duration === 30 ? "on" : ""}
                          onClick={() => changeDuration(30)}
                        >
                          30s
                        </button>
                        <button
                          className={duration === 60 ? "on" : ""}
                          onClick={() => changeDuration(60)}
                        >
                          60s
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="metrics-row">
                    <Metric
                      label={t.wpm}
                      value={
                        test.result?.wpm ??
                        (test.running
                          ? Math.round(
                              test.value.length /
                                5 /
                                Math.max(0.1, (duration - test.remaining) / 60),
                            )
                          : 0)
                      }
                      icon={<Zap size={15} />}
                    />
                    <Metric
                      label={t.accuracy}
                      value={`${test.result?.accuracy ?? (test.value.length ? Math.round((Array.from(test.value).filter((char, index) => char === Array.from(text)[index]).length / test.value.length) * 100) : 100)}%`}
                      icon={<Target size={15} />}
                    />
                    <Metric
                      label={t.errors}
                      value={
                        test.result?.errors ??
                        Array.from(test.value).filter(
                          (char, index) => char !== Array.from(text)[index],
                        ).length
                      }
                      icon={<Activity size={15} />}
                    />
                    <Metric
                      label={t.timeLeft}
                      value={`${test.remaining}s`}
                      icon={<Clock3 size={15} />}
                    />
                  </div>

                  <div className="typing-card glass-panel">
                    <div className="typing-card-head">
                      <span className="live-indicator">
                        <i />{" "}
                        {test.running
                          ? "LIVE SESSION"
                          : test.finished
                            ? "SESSION COMPLETE"
                            : "READY TO PRACTICE"}
                      </span>
                      <span className="keyboard-hint">
                        <Keyboard size={15} /> {t.keyboardTip}
                      </span>
                    </div>
                    <div
                      className={`passage ${language === "fa" ? "passage-fa" : ""}`}
                      dir={language === "fa" ? "rtl" : "ltr"}
                    >
                      {renderPassage()}
                    </div>
                    <textarea
                      className="typing-input"
                      value={test.value}
                      onChange={(event) =>
                        test.handleChange(event.target.value)
                      }
                      onPaste={(event) => event.preventDefault()}
                      disabled={test.finished}
                      placeholder={t.placeholder}
                      aria-label={t.placeholder}
                      spellCheck={false}
                      dir={language === "fa" ? "rtl" : "ltr"}
                    />
                    <div className="typing-footer">
                      <span>
                        {test.value.length} / {Array.from(text).length}{" "}
                        {t.chars}
                      </span>
                      <div className="typing-actions">
                        <button className="text-button" onClick={startRandom}>
                          <Sparkles size={15} /> {t.random}
                        </button>
                        <button
                          className="secondary-button"
                          onClick={resetCurrent}
                        >
                          <RotateCcw size={15} /> {t.reset}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="target-row">
                    <div className="target-card">
                      <span className="target-icon">
                        <Target size={17} />
                      </span>
                      <div>
                        <small>{t.target}</small>
                        <strong>
                          {selectedLesson.targetWpm} {t.wpm} <span>·</span>{" "}
                          {selectedLesson.targetAccuracy}% {t.accuracy}
                        </strong>
                      </div>
                    </div>
                    <div className="target-card">
                      <span className="target-icon blue">
                        <BookOpen size={17} />
                      </span>
                      <div>
                        <small>{t.goal}</small>
                        <strong>
                          {wordsTyped} {t.words} <span>·</span>{" "}
                          {test.value.length} {t.chars}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {test.finished && test.result && (
                      <motion.div
                        className={`result-card glass-panel ${lessonPassed ? "result-success" : ""}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="result-badge">
                          {lessonPassed ? (
                            <Trophy size={20} />
                          ) : (
                            <Activity size={20} />
                          )}
                        </div>
                        <div className="result-copy">
                          <h3>{lessonPassed ? t.goodJob : t.complete}</h3>
                          <p>
                            {lessonPassed ? t.lessonPassed : t.lessonNotPassed}
                          </p>
                          <div className="result-numbers">
                            <span>
                              <strong>{test.result.wpm}</strong> {t.wpm}
                            </span>
                            <span>
                              <strong>{test.result.accuracy}%</strong>{" "}
                              {t.accuracy}
                            </span>
                            <span>
                              <strong>{test.result.errors}</strong> {t.errors}
                            </span>
                          </div>
                        </div>
                        <div className="result-buttons">
                          <button
                            className="secondary-button"
                            onClick={resetCurrent}
                          >
                            <RotateCcw size={15} /> {t.tryAgain}
                          </button>
                          {lessonPassed &&
                            selectedLesson.id < lessons.length && (
                              <button
                                className="primary-button"
                                onClick={goNextLesson}
                              >
                                {t.nextLesson} <ArrowRight size={16} />
                              </button>
                            )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="under-note">
                    <Sparkles size={14} /> {t.clear}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === "progress" && (
            <motion.div
              key="progress"
              className="page secondary-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <PageTitle
                icon={<Activity />}
                kicker={t.progress}
                title={t.dashboard}
                subtitle={t.subtitle}
              />
              <section className="stat-grid progress-stats">
                <StatCard
                  icon={<Gauge />}
                  label={t.bestSpeed}
                  value={stats.bestWpm}
                  unit={t.wpm}
                  accent="purple"
                />
                <StatCard
                  icon={<Target />}
                  label={t.avgAccuracy}
                  value={`${stats.bestAccuracy}%`}
                  accent="blue"
                />
                <StatCard
                  icon={<BookOpen />}
                  label={t.testsDone}
                  value={stats.completedTests}
                  accent="pink"
                />
                <StatCard
                  icon={<Flame />}
                  label={t.streak}
                  value={stats.streak}
                  accent="green"
                />
              </section>
              <section className="glass-panel history-panel">
                <div className="panel-heading">
                  <div>
                    <span className="section-kicker">{t.progress}</span>
                    <h2>{t.recent}</h2>
                  </div>
                  <span className="count-pill">{stats.history.length}</span>
                </div>
                {stats.history.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Activity />
                    </div>
                    <h3>{t.noHistory}</h3>
                    <p>{t.keepGoing}</p>
                    <button
                      className="primary-button"
                      onClick={() => setActiveTab("practice")}
                    >
                      {t.practice} <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="history-list">
                    {stats.history.map((item, index) => (
                      <div
                        className="history-item"
                        key={`${item.completedAt}-${index}`}
                      >
                        <span className="history-icon">
                          <Keyboard size={17} />
                        </span>
                        <div className="history-name">
                          <strong>{item.lessonTitle}</strong>
                          <small>
                            {formatDate(item.completedAt, language)} ·{" "}
                            {item.duration}s test
                          </small>
                        </div>
                        <div className="history-stat">
                          <strong>{item.wpm}</strong>
                          <small>{t.wpm}</small>
                        </div>
                        <div className="history-stat">
                          <strong>{item.accuracy}%</strong>
                          <small>{t.accuracy}</small>
                        </div>
                        <span
                          className={
                            item.errors === 0
                              ? "error-count clean"
                              : "error-count"
                          }
                        >
                          {item.errors} {t.errors}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <section className="glass-panel course-summary">
                <div className="panel-heading">
                  <div>
                    <span className="section-kicker">{t.lessons}</span>
                    <h2>{t.progressLabel}</h2>
                  </div>
                  <strong className="summary-percent">{coursePercent}%</strong>
                </div>
                <div className="progress-track large">
                  <span style={{ width: `${coursePercent}%` }} />
                </div>
                <p>
                  {stats.unlockedLessons.length} / {lessons.length} {t.lessons}{" "}
                  {t.unlocked.toLowerCase()}
                </p>
              </section>
            </motion.div>
          )}

          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              className="page secondary-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <PageTitle
                icon={<Award />}
                kicker={t.achievements}
                title={t.achievementsTitle}
                subtitle={t.keepGoing}
              />
              <div className="achievement-grid">
                {achievementList.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`achievement-card glass-panel ${item.done ? "earned" : ""}`}
                    >
                      <div className="achievement-icon">
                        <Icon size={24} />
                      </div>
                      <div className="achievement-status">
                        {item.done ? (
                          <>
                            <Check size={13} /> {t.completed}
                          </>
                        ) : (
                          t.notYet
                        )}
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                      <div className="achievement-bottom">
                        <span>{item.done ? "100%" : "0%"}</span>
                        <div className="progress-track">
                          <span style={{ width: item.done ? "100%" : "0%" }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Parday Typing</span>
        <span>
          <Sparkles size={13} /> {t.footer}
        </span>
        <span className="footer-status">
          <i /> LOCAL SAVE ACTIVE
        </span>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  accent: string;
}) {
  return (
    <div className="stat-card glass-panel">
      <span className={`stat-icon ${accent}`}>{icon}</span>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>
          {value}
          {unit && <small> {unit}</small>}
        </strong>
      </div>
      <span className={`stat-glow ${accent}`} />
    </div>
  );
}
function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="metric">
      <span>
        {icon}
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}
function PageTitle({
  icon,
  kicker,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="page-title">
      <div className="page-title-icon">{icon}</div>
      <div>
        <span className="section-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

export default App;
