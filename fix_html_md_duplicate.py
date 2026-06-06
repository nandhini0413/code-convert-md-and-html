from pathlib import Path
import re

path = Path('index.html')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r"(\s*\}\);\n\n\s*// Hyperlink\n(?:.*?\n)*?\s*// Remove extra spaces and blank lines\n", re.DOTALL)
new = "                });\n\n            // Remove extra spaces and blank lines\n"
new_text, count = pattern.subn(new, text, count=1)
print('replacements', count)
path.write_text(new_text, encoding='utf-8')
