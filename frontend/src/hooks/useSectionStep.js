import { useState, useEffect, useRef } from "react";
import { useQuiz } from "../context/QuizContext";

export function useSectionStep(sectionKey, lastStep, forwardStep = 0, isStepAnswered) {
  const { state, updateSectionStep } = useQuiz();
  const navDirection = state.navDirection;
  const stored = state.sectionSteps?.[sectionKey];
  const isNumeric = typeof lastStep === "number";
  const answeredRef = useRef(isStepAnswered);
  answeredRef.current = isStepAnswered;

  const findFirstUnanswered = (checkFn = answeredRef.current) => {
    if (!isNumeric || typeof checkFn !== "function") {
      return stored !== undefined && stored !== null ? stored : forwardStep;
    }
    for (let i = 0; i <= lastStep; i += 1) {
      if (!checkFn(i)) return i;
    }
    return lastStep;
  };

  const resolveInitial = () => {
    if (!isNumeric) {
      if (stored !== undefined && stored !== null) return stored;
      return navDirection === "backward" ? lastStep : forwardStep;
    }
    const firstOpen = findFirstUnanswered(isStepAnswered);
    if (navDirection === "backward") return firstOpen;
    if (stored === undefined || stored === null) return firstOpen;
    return Math.min(Number(stored) || 0, firstOpen);
  };

  const [step, setStepInternal] = useState(resolveInitial);

  useEffect(() => {
    if (!isNumeric || typeof answeredRef.current !== "function") return;
    const firstOpen = findFirstUnanswered();
    setStepInternal((prev) => {
      if (prev <= firstOpen) return prev;
      if (updateSectionStep) updateSectionStep(sectionKey, firstOpen);
      return firstOpen;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, sectionKey]);

  const setStep = (value) => {
    setStepInternal((prev) => {
      let next = typeof value === "function" ? value(prev) : value;
      if (isNumeric && typeof answeredRef.current === "function" && typeof next === "number") {
        const check = answeredRef.current;
        if (next > prev) {
          if (!check(prev)) return prev;
          next = Math.min(next, prev + 1);
        }
      }
      if (updateSectionStep) updateSectionStep(sectionKey, next);
      return next;
    });
  };

  return [step, setStep];
}
