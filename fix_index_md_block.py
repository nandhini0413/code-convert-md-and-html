from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
needle = '            // Paragraph'
first = text.find(needle)
second = text.find(needle, first + 1)
if first == -1 or second == -1:
    raise RuntimeError('Could not find duplicate Paragraph marker')
end = text.find('            mdOutput.value = md;', second)
if end == -1:
    raise RuntimeError('Could not find mdOutput end marker')
new = '            // Remove extra spaces and blank lines\n            md = md.replace(/\\n{3,}/g, "\\n\\n");\n            md = md.trim();\n\n'
text = text[:second] + new + text[end:]
path.write_text(text, encoding='utf-8')
print('patched')
