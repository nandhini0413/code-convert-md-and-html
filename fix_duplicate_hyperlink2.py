from pathlib import Path
path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = '            // Hyperlink\n'
first = text.find(marker)
if first == -1:
    raise RuntimeError('No Hyperlink marker found')
second = text.find(marker, first + 1)
if second == -1:
    raise RuntimeError('Second Hyperlink marker not found')
cleanup = text.find('            // Remove extra spaces and blank lines\n', second)
if cleanup == -1:
    raise RuntimeError('Cleanup comment not found after duplicate hyperlink block')
text = text[:second] + text[cleanup:]
path.write_text(text, encoding='utf-8')
print('removed duplicate hyperlink block')
