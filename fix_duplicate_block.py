from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
start = text.find('md = md.replace(/<p[^>]*>(.*?)</p>/gis, "$1\\n");')
if start == -1:
    raise RuntimeError('Paragraph pattern not found')
second = text.find('md = md.replace(/<p[^>]*>(.*?)</p>/gis, "$1\\n");', start + 1)
if second == -1:
    raise RuntimeError('Duplicate paragraph pattern not found')
cleanup = text.find('// Remove extra spaces and blank lines', second)
if cleanup == -1:
    raise RuntimeError('Cleanup comment not found after duplicate block')
text = text[:second] + text[cleanup:]
path.write_text(text, encoding='utf-8')
print('removed duplicate block')
