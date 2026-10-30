path = 'frontend/src/components/Result.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace selectedPlanId default: "3_month" -> "1_month"
text = text.replace('useState("3_month")', 'useState("1_month")')

# Replace selectedPlan derivation with safe fallbacks
old_sel = "  const selectedPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];"
new_sel = """  const selectedPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1] || PRICING_PLANS[0];
  const selectedPlanPrice = selectedPlan?.discountedPrice || selectedPlan?.price || "₹499";
  const selectedPlanTitle = selectedPlan?.title || selectedPlan?.name || "1-Month Plan";"""

text = text.replace(old_sel, new_sel)

# Replace usage in checkout buttons & modal
text = text.replace('selectedPlan.price', 'selectedPlanPrice')
text = text.replace('selectedPlan.name', 'selectedPlanTitle')

# Replace the pricing cards block
old_pricing_block = """        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 text-left">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#7A35A3] bg-gradient-to-b from-[#FBF7FE] to-white shadow-md ring-2 ring-[#7A35A3]/20"
                    : "border-[#EADBFA] bg-white hover:border-[#7A35A3]/40"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820] text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular Choice
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-bold text-base text-gray-900">{plan.name}</h3>
                    <span className="text-xs font-bold text-[#7A35A3] bg-[#F4E8FC] px-2 py-0.5 rounded-md">
                      {plan.discount}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-sans text-3xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {plan.originalPrice}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A35A3] font-semibold mt-0.5">
                    {plan.perDay}
                  </p>

                  <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-[#EADBFA]/70 leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlanId(plan.id);
                    setIsCheckoutOpen(true);
                  }}
                  className={`mt-6 w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    isSelected
                      ? "bg-[#7A35A3] text-white hover:bg-[#5C237D]"
                      : "bg-[#F4E8FC] text-[#4A1766] hover:bg-[#EADBFA]"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Select {plan.name}</span>
                </button>
              </div>
            );
          })}
        </div>"""

new_pricing_block = """        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 text-left">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const planTitle = plan.title || plan.name || "Custom Plan";
            const planPrice = plan.discountedPrice || plan.price || "₹499";
            const planBadge = plan.badge || plan.discount || "50% OFF";
            const planRate = plan.dailyRate ? `${plan.dailyRate}` : plan.perDay || "";
            const planFeatures = plan.features || [
              "11-Condition Biometric Profile",
              "Personalized AM/PM Topical Regimen",
              "Direct WhatsApp Advisor Access",
              "4-Week Transformation Monitoring",
            ];

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#7A35A3] bg-gradient-to-b from-[#FBF7FE] to-white shadow-md ring-2 ring-[#7A35A3]/20"
                    : "border-[#EADBFA] bg-white hover:border-[#7A35A3]/40"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820] text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular Choice
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-bold text-base text-gray-900">{planTitle}</h3>
                    <span className="text-xs font-bold text-[#7A35A3] bg-[#F4E8FC] px-2 py-0.5 rounded-md">
                      {planBadge}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-sans text-3xl font-extrabold text-gray-900">
                      {planPrice}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  {planRate && (
                    <p className="text-xs text-[#7A35A3] font-semibold mt-0.5">
                      {planRate} {plan.period ? `· ${plan.period}` : ""}
                    </p>
                  )}

                  <ul className="mt-4 space-y-2 text-xs text-gray-700 pt-3 border-t border-[#EADBFA]/70">
                    {planFeatures.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlanId(plan.id);
                    setIsCheckoutOpen(true);
                  }}
                  className={`mt-6 w-full py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    isSelected
                      ? "bg-[#7A35A3] text-white hover:bg-[#5C237D]"
                      : "bg-[#F4E8FC] text-[#4A1766] hover:bg-[#EADBFA]"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Select {planTitle}</span>
                </button>
              </div>
            );
          })}
        </div>"""

norm_text = text.replace('\r\n', '\n')
norm_old_block = old_pricing_block.replace('\r\n', '\n')
norm_new_block = new_pricing_block.replace('\r\n', '\n')

assert norm_old_block in norm_text, "Old pricing block not found!"
norm_text = norm_text.replace(norm_old_block, norm_new_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(norm_text)

print("Pricing plans mapping updated successfully!")
