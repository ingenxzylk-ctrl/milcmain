import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "../../context/QuizContext";
import { useSectionStep } from "../../hooks/useSectionStep";
import { SKIN_PROFILE_QUESTIONS } from "../../data/questions";
import QuestionLayout, { OptionButton } from "../QuestionLayout";

export default function Section2SkinProfile({ onComplete, onBack }) {
  const { state, updateSkinProfile } = useQuiz();
  const [localForm, setLocalForm] = useState({
    skinType: state?.skinProfile?.skinType || "",
    mainConcern: state?.skinProfile?.mainConcern || "",
    middayFeel: state?.skinProfile?.middayFeel || "",
    breakouts: state?.skinProfile?.breakouts || "",
    concernDuration: state?.skinProfile?.concernDuration || "",
  });
  const [error, setError] = useState("");

  const isStepAnswered = (i) => Boolean(localForm[SKIN_PROFILE_QUESTIONS[i].id]);
  const [step, setStep] = useSectionStep("section2SkinProfile", SKIN_PROFILE_QUESTIONS.length - 1, 0, isStepAnswered);
  const question = SKIN_PROFILE_QUESTIONS[step];

  const handleSelect = (id) => {
    const next = { ...localForm, [question.id]: id };
    setLocalForm(next);
    updateSkinProfile(next);
    setError("");
  };

  const handleContinue = () => {
    if (!localForm[question.id]) {
      setError("Please select an option to continue.");
      return;
    }
    if (step < SKIN_PROFILE_QUESTIONS.length - 1) {
      setStep((p) => p + 1);
      return;
    }
    updateSkinProfile(localForm);
    onComplete?.();
  };

  return (
    <QuestionLayout
      badge={`SKIN PROFILE (${step + 1}/${SKIN_PROFILE_QUESTIONS.length})`}
      title={question.title}
      subtitle={question.subtitle}
      error={error}
      onBack={() => (step > 0 ? setStep((p) => p - 1) : onBack?.())}
      onContinue={handleContinue}
      continueLabel={step === SKIN_PROFILE_QUESTIONS.length - 1 ? "Save Skin Profile" : "Continue"}
      continueDisabled={!localForm[question.id]}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 gap-2.5"
        >
          {question.options.map((opt) => (
            <OptionButton
              key={opt.id}
              label={opt.label}
              selected={localForm[question.id] === opt.id}
              onClick={() => handleSelect(opt.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </QuestionLayout>
  );
}
