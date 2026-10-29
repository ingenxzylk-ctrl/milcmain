import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "../../context/QuizContext";
import { useSectionStep } from "../../hooks/useSectionStep";
import { LIFESTYLE_QUESTIONS } from "../../data/questions";
import QuestionLayout, { OptionButton } from "../QuestionLayout";

export default function Section3Lifestyle({ onComplete, onBack }) {
  const { state, updateLifestyle } = useQuiz();
  const [localForm, setLocalForm] = useState({
    sleep: state?.lifestyle?.sleep || "",
    stress: state?.lifestyle?.stress || "",
    sunExposure: state?.lifestyle?.sunExposure || "",
    sunscreen: state?.lifestyle?.sunscreen || "",
    water: state?.lifestyle?.water || "",
    conditions: Array.isArray(state?.lifestyle?.conditions) ? state.lifestyle.conditions : [],
    conditionsOther: state?.lifestyle?.conditionsOther || "",
    routine: state?.lifestyle?.routine || "",
    treatments: state?.lifestyle?.treatments || "",
    treatmentsNote: state?.lifestyle?.treatmentsNote || "",
  });
  const [error, setError] = useState("");

  const isStepAnswered = (i) => {
    const q = LIFESTYLE_QUESTIONS[i];
    if (q.multi) {
      if (!localForm.conditions.length) return false;
      if (localForm.conditions.includes("other") && !String(localForm.conditionsOther || "").trim()) return false;
      return true;
    }
    if (!localForm[q.id]) return false;
    if (q.textWhen && localForm[q.id] === q.textWhen && !String(localForm.treatmentsNote || "").trim()) return false;
    return true;
  };

  const [step, setStep] = useSectionStep("section3Lifestyle", LIFESTYLE_QUESTIONS.length - 1, 0, isStepAnswered);
  const question = LIFESTYLE_QUESTIONS[step];

  const persist = (next) => {
    setLocalForm(next);
    updateLifestyle(next);
    setError("");
  };

  const handleSelect = (id) => {
    if (question.multi) {
      let nextSelected = [...localForm.conditions];
      if (id === "none") {
        nextSelected = nextSelected.includes("none") ? [] : ["none"];
      } else {
        nextSelected = nextSelected.filter((x) => x !== "none");
        nextSelected = nextSelected.includes(id)
          ? nextSelected.filter((x) => x !== id)
          : [...nextSelected, id];
      }
      persist({ ...localForm, conditions: nextSelected });
      return;
    }
    persist({ ...localForm, [question.id]: id });
  };

  const handleContinue = () => {
    if (!isStepAnswered(step)) {
      setError("Please complete this question to proceed.");
      return;
    }
    if (step < LIFESTYLE_QUESTIONS.length - 1) {
      setStep((p) => p + 1);
      return;
    }
    updateLifestyle(localForm);
    onComplete?.();
  };

  const selected = question.multi ? localForm.conditions : localForm[question.id];

  return (
    <QuestionLayout
      badge={`LIFESTYLE & HEALTH (${step + 1}/${LIFESTYLE_QUESTIONS.length})`}
      title={question.title}
      subtitle={question.subtitle}
      error={error}
      onBack={() => (step > 0 ? setStep((p) => p - 1) : onBack?.())}
      onContinue={handleContinue}
      continueLabel={step === LIFESTYLE_QUESTIONS.length - 1 ? "Complete Lifestyle" : "Continue"}
      continueDisabled={!isStepAnswered(step)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((opt) => (
              <OptionButton
                key={opt.id}
                label={opt.label}
                multi={question.multi}
                selected={question.multi ? selected.includes(opt.id) : selected === opt.id}
                onClick={() => handleSelect(opt.id)}
              />
            ))}
          </div>

          {question.multi && localForm.conditions.includes("other") && (
            <motion.input
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              value={localForm.conditionsOther}
              onChange={(e) => persist({ ...localForm, conditionsOther: e.target.value })}
              placeholder="Please specify condition..."
              className="mt-3 w-full h-13 px-4 border border-gray-200/90 rounded-2xl bg-white text-sm focus:border-[#7A35A3] focus:ring-2 focus:ring-[#7A35A3]/20 outline-none"
            />
          )}

          {question.textWhen && localForm[question.id] === question.textWhen && (
            <motion.input
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              value={localForm.treatmentsNote}
              onChange={(e) => persist({ ...localForm, treatmentsNote: e.target.value })}
              placeholder={question.textPlaceholder}
              className="mt-3 w-full h-13 px-4 border border-gray-200/90 rounded-2xl bg-white text-sm focus:border-[#7A35A3] focus:ring-2 focus:ring-[#7A35A3]/20 outline-none"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </QuestionLayout>
  );
}
