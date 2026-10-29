import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Phone, User, Compass, ChevronDown, Check } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { useSectionStep } from "../../hooks/useSectionStep";
import { normalizeLocalPhone, sanitizePhoneInput } from "../../utils/phone";
import { isValidIndianPincode, normalizeIndianPincode } from "../../utils/pincode";
import { lookupPincode, reverseGeocodeLocation } from "../../api/quizApi";
import { resolveQuizLocation } from "../../utils/geolocation";
import { COUNTRY_CODES, DEFAULT_COUNTRY } from "../../data/countryCodes";
import { ageBand } from "../../data/attributes";
import QuestionLayout from "../QuestionLayout";

const STEPS = ["name", "contact", "age", "gender"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const STEP_TITLES = {
  name: {
    title: "What should we call you?",
    subtitle: "We'll use your first name to personalize your diagnostic skin report.",
  },
  contact: {
    title: "Where should we deliver your report?",
    subtitle: "Provide WhatsApp and email to receive your skin routine. Enter pincode for climate considerations.",
  },
  age: {
    title: "What is your current age?",
    subtitle: "Age allows our AI model to contextualize skin barrier renewal, elasticity, and collagen turnover.",
  },
  gender: {
    title: "How do you identify?",
    subtitle: "Used strictly for routine formulation phrasing — all skin types receive comprehensive care.",
  },
};

export default function Section1AboutYou({ onComplete, onBack }) {
  const { state, updateAboutMe } = useQuiz();
  const [errors, setErrors] = useState({});
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const countryMenuRef = useRef(null);
  const pinLookupSeq = useRef(0);
  const lastLookedUpPin = useRef("");
  const persistTimer = useRef(null);
  const localFormRef = useRef(null);
  const [pinLookup, setPinLookup] = useState("idle");
  const [geoStatus, setGeoStatus] = useState("idle");

  const initialCountry =
    COUNTRY_CODES.find(
      (c) =>
        c.code === (state?.aboutMe?.countryCode || DEFAULT_COUNTRY.code) &&
        (state?.aboutMe?.countryName ? c.name === state.aboutMe.countryName : true)
    ) || DEFAULT_COUNTRY;

  const [localForm, setLocalForm] = useState({
    fullName: state?.aboutMe?.fullName || "",
    whatsapp: normalizeLocalPhone(state?.aboutMe?.whatsapp || "", state?.aboutMe?.countryCode || DEFAULT_COUNTRY.code),
    email: state?.aboutMe?.email || "",
    city: state?.aboutMe?.city || "",
    pincode: normalizeIndianPincode(state?.aboutMe?.pincode || ""),
    state: state?.aboutMe?.state || "",
    countryCode: initialCountry.code,
    countryName: state?.aboutMe?.countryName || initialCountry.name,
    age: state?.aboutMe?.age || "",
    ageRange: state?.aboutMe?.ageRange || "",
    gender: state?.aboutMe?.gender || "",
  });
  localFormRef.current = localForm;

  const toPayload = (form) => ({
    fullName: form.fullName,
    whatsapp: form.whatsapp,
    email: form.email,
    city: form.city,
    pincode: form.pincode,
    state: form.state,
    countryCode: form.countryCode,
    countryName: form.countryName,
    age: form.age,
    ageRange: form.ageRange,
    gender: form.gender,
  });

  const flushAboutMe = () => {
    if (persistTimer.current) {
      clearTimeout(persistTimer.current);
      persistTimer.current = null;
    }
    if (updateAboutMe && localFormRef.current) updateAboutMe(toPayload(localFormRef.current));
  };

  useEffect(() => {
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
      if (updateAboutMe && localFormRef.current) updateAboutMe(toPayload(localFormRef.current));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isStepAnswered = (stepIndex) => {
    if (stepIndex === 0) return Boolean(localForm.fullName.trim());
    if (stepIndex === 1) {
      const phone = normalizeLocalPhone(localForm.whatsapp, localForm.countryCode);
      const pin = normalizeIndianPincode(localForm.pincode);
      return (
        phone.length === 10 &&
        Boolean(localForm.email.trim()) &&
        EMAIL_REGEX.test(localForm.email.trim()) &&
        isValidIndianPincode(pin) &&
        pinLookup !== "invalid" &&
        Boolean(localForm.city.trim())
      );
    }
    if (stepIndex === 2) {
      const ageNum = Number(localForm.age);
      return Number.isFinite(ageNum) && ageNum >= 13 && ageNum <= 100;
    }
    if (stepIndex === 3) return Boolean(localForm.gender);
    return false;
  };

  const [step, setStep] = useSectionStep("section1AboutYou", STEPS.length - 1, 0, isStepAnswered);

  const selectedCountry =
    COUNTRY_CODES.find(
      (c) => c.code === localForm.countryCode && c.name === (localForm.countryName || DEFAULT_COUNTRY.name)
    ) ||
    COUNTRY_CODES.find((c) => c.code === localForm.countryCode) ||
    DEFAULT_COUNTRY;

  useEffect(() => {
    if (!countryMenuOpen) return undefined;
    const onPointerDown = (event) => {
      if (!countryMenuRef.current?.contains(event.target)) setCountryMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [countryMenuOpen]);

  useEffect(() => {
    const pin = normalizeIndianPincode(localForm.pincode);
    if (!isValidIndianPincode(pin)) {
      if (pinLookup !== "idle" && pin.length < 6) setPinLookup("idle");
      return undefined;
    }
    if (lastLookedUpPin.current === pin && pinLookup === "found") return undefined;
    const seq = (pinLookupSeq.current += 1);
    lastLookedUpPin.current = pin;
    setPinLookup("loading");
    lookupPincode(pin)
      .then((data) => {
        if (seq !== pinLookupSeq.current) return;
        if (!data?.ok) {
          setPinLookup(data?.reason === "not_found" ? "invalid" : "error");
          return;
        }
        setPinLookup("found");
        handleChange({ city: data.city || localForm.city, state: data.state || localForm.state, pincode: pin });
      })
      .catch(() => {
        if (seq !== pinLookupSeq.current) return;
        setPinLookup("error");
      });
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localForm.pincode]);

  const handleUseLocation = async () => {
    setGeoStatus("locating");
    const result = await resolveQuizLocation({ reverseGeocode: reverseGeocodeLocation });
    if (result.kind === "gps") {
      const data = result.data;
      const pin = data.fill === "pin" && isValidIndianPincode(data.pincode) ? data.pincode : "";
      lastLookedUpPin.current = pin;
      setPinLookup(pin ? "found" : "idle");
      handleChange({ pincode: pin, city: data.city || "", state: data.state || "" });
      setGeoStatus(pin ? "verify_pin" : "enter_pin");
      return;
    }
    if (result.kind === "coarse") {
      setGeoStatus("coarse");
      return;
    }
    if (result.kind === "outside") {
      setGeoStatus("outside");
      return;
    }
    setGeoStatus(result.status || "error");
  };

  const handleChange = (fields) => {
    setLocalForm((prev) => {
      const next = { ...prev, ...fields };
      localFormRef.current = next;
      if (updateAboutMe) {
        if (persistTimer.current) clearTimeout(persistTimer.current);
        persistTimer.current = setTimeout(() => updateAboutMe(toPayload(localFormRef.current)), 400);
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [Object.keys(fields)[0]]: "" }));
  };

  const validate = () => {
    const e = {};
    if (step === 0 && !localForm.fullName.trim()) e.fullName = "Name is required";
    if (step === 1) {
      const phone = normalizeLocalPhone(localForm.whatsapp, localForm.countryCode);
      if (!phone) e.whatsapp = "WhatsApp number is required";
      else if (phone.length !== 10) e.whatsapp = "WhatsApp number must be 10 digits";
      const email = localForm.email.trim();
      if (!email) e.email = "Email is required";
      else if (!EMAIL_REGEX.test(email)) e.email = "Please enter a valid email address";
      const pin = normalizeIndianPincode(localForm.pincode);
      if (!pin) e.pincode = "Pincode is required";
      else if (!isValidIndianPincode(pin)) e.pincode = "Enter a valid 6-digit pincode";
      else if (pinLookup === "invalid") e.pincode = "This pincode was not found — please verify";
      if (!localForm.city.trim()) e.city = pinLookup === "loading" ? "Looking up city…" : "City is required";
    }
    if (step === 2) {
      const ageNum = Number(localForm.age);
      if (!localForm.age || !Number.isFinite(ageNum)) e.age = "Please enter your age";
      else if (ageNum < 13 || ageNum > 100) e.age = "Please enter an age between 13 and 100";
    }
    if (step === 3 && !localForm.gender) e.gender = "Please select an option";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate() || !isStepAnswered(step)) return;
    const next = {
      ...toPayload(localForm),
      email: localForm.email.trim(),
      fullName: localForm.fullName.trim(),
      whatsapp: normalizeLocalPhone(localForm.whatsapp, localForm.countryCode),
      ageRange: ageBand(localForm.age) || localForm.ageRange || "",
    };
    localFormRef.current = { ...localForm, ...next };
    flushAboutMe();
    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    for (let i = 0; i < STEPS.length; i += 1) {
      if (!isStepAnswered(i)) {
        setStep(i);
        return;
      }
    }
    if (onComplete) onComplete();
  };

  const headingInfo = STEP_TITLES[STEPS[step]];
  const inputClass = (err) =>
    `w-full h-14 px-4 bg-white/90 border rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7A35A3]/20 focus:border-[#7A35A3] transition-all text-sm shadow-xs ${
      err ? "border-red-500 ring-1 ring-red-200" : "border-gray-200/90 hover:border-gray-300"
    }`;

  return (
    <QuestionLayout
      badge={`ABOUT YOU (${step + 1}/${STEPS.length})`}
      title={headingInfo.title}
      subtitle={headingInfo.subtitle}
      onBack={() => (step > 0 ? setStep((p) => p - 1) : onBack?.())}
      onContinue={handleContinue}
      continueLabel={step === STEPS.length - 1 ? "Save & Continue" : "Continue"}
      continueDisabled={!isStepAnswered(step)}
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-name"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col gap-2 pt-1"
          >
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#4A1766]" />
              First name / Preferred Name
            </label>
            <input
              type="text"
              autoFocus
              value={localForm.fullName}
              onChange={(e) => handleChange({ fullName: e.target.value })}
              placeholder="e.g. Sarah"
              className={inputClass(errors.fullName)}
            />
            {errors.fullName && <p className="text-xs text-red-500 font-medium mt-0.5">{errors.fullName}</p>}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step-contact"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4 pt-1"
          >
            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#4A1766]" />
                WhatsApp Number
              </label>
              <div className="flex gap-2">
                <div className="relative shrink-0" ref={countryMenuRef}>
                  <button
                    type="button"
                    onClick={() => setCountryMenuOpen((o) => !o)}
                    className="h-14 w-[6.75rem] px-2.5 border border-gray-200/90 rounded-2xl bg-white text-sm font-medium flex items-center justify-between gap-1 cursor-pointer hover:border-gray-300 shadow-xs"
                  >
                    <span className="truncate">
                      {selectedCountry.flag} {selectedCountry.code}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {countryMenuOpen && (
                    <ul className="absolute left-0 top-[calc(100%+0.35rem)] z-30 max-h-64 w-[16rem] overflow-y-auto rounded-2xl border border-gray-200 bg-white py-1 shadow-xl">
                      {COUNTRY_CODES.map((c) => (
                        <li key={`${c.name}-${c.code}`}>
                          <button
                            type="button"
                            onClick={() => {
                              handleChange({ countryCode: c.code, countryName: c.name });
                              setCountryMenuOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-[#F4F7FA] cursor-pointer"
                          >
                            <span className="text-base">{c.flag}</span>
                            <span className="font-semibold text-gray-900">{c.code}</span>
                            <span className="truncate text-gray-500">{c.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={localForm.whatsapp}
                  onChange={(e) => handleChange({ whatsapp: sanitizePhoneInput(e.target.value) })}
                  onBlur={() => {
                    const next = normalizeLocalPhone(localForm.whatsapp, localForm.countryCode);
                    if (next !== localForm.whatsapp) handleChange({ whatsapp: next });
                    flushAboutMe();
                  }}
                  placeholder="10-digit number"
                  className={`flex-1 min-w-0 h-14 px-4 bg-white/90 border rounded-2xl text-sm shadow-xs ${
                    errors.whatsapp ? "border-red-500" : "border-gray-200/90 focus:border-[#7A35A3]"
                  }`}
                />
              </div>
              {errors.whatsapp && <p className="text-xs text-red-500 font-medium">{errors.whatsapp}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#4A1766]" />
                Email Address
              </label>
              <input
                type="email"
                value={localForm.email}
                onChange={(e) => handleChange({ email: e.target.value })}
                placeholder="name@example.com"
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            {/* Pincode & City */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#4A1766]" />
                  Pincode (Climate & Weather Context)
                </label>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={geoStatus === "locating"}
                  className="text-xs font-semibold text-[#4A1766] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Compass className={`w-3 h-3 ${geoStatus === "locating" ? "animate-spin" : ""}`} />
                  <span>{geoStatus === "locating" ? "Detecting…" : "Auto-detect"}</span>
                </button>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={localForm.pincode}
                onChange={(e) => {
                  handleChange({ pincode: normalizeIndianPincode(e.target.value) });
                  if (geoStatus === "verify_pin") setGeoStatus("idle");
                }}
                placeholder="6-digit pincode"
                className={inputClass(errors.pincode)}
              />
              {pinLookup === "loading" && <p className="text-xs text-gray-400">Verifying postal location…</p>}
              {pinLookup === "found" && localForm.city && (
                <p className="text-xs text-[#4A1766] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {localForm.city}
                    {localForm.state ? `, ${localForm.state}` : ""}
                  </span>
                </p>
              )}
              {errors.pincode && pinLookup !== "invalid" && (
                <p className="text-xs text-red-500 font-medium">{errors.pincode}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">City</label>
                <input
                  type="text"
                  value={localForm.city}
                  onChange={(e) => handleChange({ city: e.target.value })}
                  placeholder="City"
                  className={inputClass(errors.city)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">State</label>
                <input
                  type="text"
                  value={localForm.state}
                  onChange={(e) => handleChange({ state: e.target.value })}
                  placeholder="State"
                  className={inputClass(false)}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-age"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col gap-2 pt-1"
          >
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Age (Years)
            </label>
            <input
              type="number"
              autoFocus
              inputMode="numeric"
              min={13}
              max={100}
              value={localForm.age}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 3);
                handleChange({ age: digits, ageRange: ageBand(digits) });
              }}
              placeholder="e.g. 26"
              className={inputClass(errors.age)}
            />
            {errors.age && <p className="text-xs text-red-500 font-medium mt-0.5">{errors.age}</p>}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step-gender"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="grid grid-cols-1 gap-2.5 pt-1"
          >
            {[
              { id: "female", label: "Female" },
              { id: "male", label: "Male" },
              { id: "prefer_not", label: "Prefer not to say" },
            ].map((g) => (
              <motion.button
                key={g.id}
                type="button"
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleChange({ gender: g.id })}
                className={`h-15 border rounded-2xl font-semibold text-sm cursor-pointer transition-all flex items-center justify-between px-5 ${
                  localForm.gender === g.id
                    ? "border-2 border-[#7A35A3] bg-[#C883EB]/15 text-[#4A1766] shadow-xs"
                    : "border-gray-200/90 text-gray-700 hover:bg-[#F4F7FA]"
                }`}
              >
                <span>{g.label}</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    localForm.gender === g.id
                      ? "border-[#7A35A3] bg-[#7A35A3] text-white"
                      : "border-gray-300"
                  }`}
                >
                  {localForm.gender === g.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </motion.button>
            ))}
            {errors.gender && <p className="text-xs text-red-500 font-medium text-center">{errors.gender}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </QuestionLayout>
  );
}
