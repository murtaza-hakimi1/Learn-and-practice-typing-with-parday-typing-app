import { useCallback, useEffect, useRef, useState } from "react";

export type TestResult = {
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalTyped: number;
  elapsedSeconds: number;
  completedAt: string;
  duration: number;
};

type Options = {
  text: string;
  duration: number;
  onFinish?: (result: TestResult) => void;
};

export function useTypingTest({ text, duration, onFinish }: Options) {
  const [value, setValue] = useState("");
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const startedAt = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const valueRef = useRef(value);
  const textRef = useRef(text);
  const durationRef = useRef(duration);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  useEffect(() => {
    textRef.current = text;
  }, [text]);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const calculate = useCallback(
    (typed: string, elapsed: number): TestResult => {
      const target = textRef.current;
      let correctChars = 0;
      let errors = 0;
      for (let i = 0; i < typed.length; i += 1) {
        if (typed[i] === target[i]) correctChars += 1;
        else errors += 1;
      }
      const safeElapsed = Math.max(1, elapsed);
      const wpm = Math.round(correctChars / 5 / (safeElapsed / 60));
      const accuracy =
        typed.length === 0
          ? 100
          : Math.round((correctChars / typed.length) * 100);
      return {
        wpm,
        accuracy,
        errors,
        correctChars,
        totalTyped: typed.length,
        elapsedSeconds: Math.round(safeElapsed),
        completedAt: new Date().toISOString(),
        duration: durationRef.current,
      };
    },
    [],
  );

  const finish = useCallback(
    (typed = valueRef.current) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const elapsed =
        startedAt.current === null
          ? 1
          : Math.min(
              durationRef.current,
              Math.max(1, (Date.now() - startedAt.current) / 1000),
            );
      const finalResult = calculate(typed, elapsed);
      setResult(finalResult);
      setFinished(true);
      setRunning(false);
      onFinishRef.current?.(finalResult);
    },
    [calculate],
  );

  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => {
      const start = startedAt.current;
      if (start === null) return;
      const elapsed = (Date.now() - start) / 1000;
      const nextRemaining = Math.max(0, duration - Math.floor(elapsed));
      setRemaining(nextRemaining);
      if (elapsed >= duration) finish();
    }, 100);
    return () => window.clearInterval(timer);
  }, [running, finished, duration, finish]);

  const handleChange = useCallback(
    (nextValue: string) => {
      if (finishedRef.current) return;
      const clipped = nextValue.slice(0, textRef.current.length);
      if (startedAt.current === null && clipped.length > 0) {
        startedAt.current = Date.now();
        setRunning(true);
      }
      valueRef.current = clipped;
      setValue(clipped);
      if (clipped.length >= textRef.current.length) finish(clipped);
    },
    [finish],
  );

  const reset = useCallback((nextText?: string, nextDuration?: number) => {
    finishedRef.current = false;
    startedAt.current = null;
    valueRef.current = "";
    if (nextText !== undefined) textRef.current = nextText;
    if (nextDuration !== undefined) durationRef.current = nextDuration;
    setValue("");
    setRemaining(nextDuration ?? durationRef.current);
    setRunning(false);
    setFinished(false);
    setResult(null);
  }, []);

  return { value, remaining, running, finished, result, handleChange, reset };
}
