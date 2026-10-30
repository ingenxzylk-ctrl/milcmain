with open('frontend/src/components/sections/Section4Scan.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace photo tips with glasses warning and clearer guidance
old_tips = """const PHOTO_TIPS = [
  { label: "No makeup", key: "makeup" },
  { label: "Natural light", key: "insufficientLight" },
  { label: "No filters", key: "filtersApplied" },
  { label: "Hair back", key: "hair" },
];"""

new_tips = """const PHOTO_TIPS = [
  { label: "Remove glasses", key: "glasses" },
  { label: "Natural front light", key: "insufficientLight" },
  { label: "No makeup or filters", key: "filtersApplied" },
  { label: "Hair tucked back", key: "hair" },
];"""

text = text.replace(old_tips.replace('\r\n', '\n'), new_tips.replace('\r\n', '\n'))
text = text.replace(old_tips.replace('\n', '\r\n'), new_tips.replace('\n', '\r\n'))

old_desc = """          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl">
            One clear photo is all we need. Neutral expression, face forward, well-lit natural environment.
          </p>"""

new_desc = """          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl">
            Please remove eyeglasses, face even natural light, and keep a neutral expression so the AI can accurately assess your raw skin surface.
          </p>"""

text = text.replace(old_desc.replace('\r\n', '\n'), new_desc.replace('\r\n', '\n'))
text = text.replace(old_desc.replace('\n', '\r\n'), new_desc.replace('\n', '\r\n'))

with open('frontend/src/components/sections/Section4Scan.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Section4Scan.jsx updated successfully!")
