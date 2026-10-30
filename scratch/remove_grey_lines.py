import re

path = 'frontend/src/components/Result.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Cards view: remove the grey line and clean up comparison row
old_cards_block = """                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600 font-medium flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-gray-500" />
                            <span>Average Score:</span>
                          </span>
                          <span className="font-mono font-bold text-gray-700">{attr.othersScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full"
                            style={{ width: `${attr.othersScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Clean Non-Overlapping Comparison Pill */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-gray-600 font-medium">Vs. Average:</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                            attr.delta > 0
                              ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                              : attr.delta < 0
                              ? "bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {attr.delta > 0
                            ? `+${attr.delta}% clearer`
                            : attr.delta < 0
                            ? `${attr.delta}% vs average`
                            : "On par with average"}
                        </span>
                      </div>"""

new_cards_block = """                      {/* Clean Comparison Row (No grey line) */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#EADBFA]/50 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>Average:</span>
                          <span className="font-mono font-bold text-gray-800">{attr.othersScore}%</span>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                            attr.delta > 0
                              ? "bg-[#D4FF3F] text-[#1E2700] border border-[#BDE820]"
                              : attr.delta < 0
                              ? "bg-[#F4E8FC] text-[#4A1766] border border-[#EADBFA]"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {attr.delta > 0
                            ? `+${attr.delta}% clearer`
                            : attr.delta < 0
                            ? `${attr.delta}% vs avg`
                            : "On par"}
                        </span>
                      </div>"""

# 2. Update Comparison Chart view: remove the grey line
old_chart_block = """                    <div className="col-span-5 sm:col-span-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-8 font-mono text-xs font-bold text-[#4A1766] text-right">
                          {attr.userScore}%
                        </span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7A35A3] to-[#C883EB] rounded-full"
                            style={{ width: `${attr.userScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-8 font-mono text-xs text-gray-500 text-right">
                          {attr.othersScore}%
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full"
                            style={{ width: `${attr.othersScore}%` }}
                          />
                        </div>
                      </div>
                    </div>"""

new_chart_block = """                    <div className="col-span-5 sm:col-span-6">
                      <div className="flex items-center gap-2">
                        <span className="w-8 font-mono text-xs font-bold text-[#4A1766] text-right">
                          {attr.userScore}%
                        </span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7A35A3] to-[#C883EB] rounded-full"
                            style={{ width: `${attr.userScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1 pl-10">
                        <span>Average: <strong className="font-mono font-bold text-gray-700">{attr.othersScore}%</strong></span>
                      </div>
                    </div>"""

# Normalize
norm_text = text.replace('\r\n', '\n')
norm_old_cards = old_cards_block.replace('\r\n', '\n')
norm_new_cards = new_cards_block.replace('\r\n', '\n')
norm_old_chart = old_chart_block.replace('\r\n', '\n')
norm_new_chart = new_chart_block.replace('\r\n', '\n')

assert norm_old_cards in norm_text, "Cards block not found!"
assert norm_old_chart in norm_text, "Chart block not found!"

norm_text = norm_text.replace(norm_old_cards, norm_new_cards)
norm_text = norm_text.replace(norm_old_chart, norm_new_chart)

with open(path, 'w', encoding='utf-8') as f:
    f.write(norm_text)

print("Successfully removed all grey line representations from Result.jsx!")
