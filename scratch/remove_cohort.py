import re

path = 'frontend/src/components/Result.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to remove the div containing Cohort Average
pattern = r'\s*<div className="flex items-center gap-1\.5 ml-auto">\s*<span className="w-3\.5 h-1\.5 bg-slate-400 rounded-sm" />\s*<span className="text-gray-600 font-medium">Grey Bar = Cohort Average</span>\s*</div>'

new_text, count = re.subn(pattern, '', text)
print(f"Substitutions made: {count}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_text)
