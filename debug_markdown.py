from pathlib import Path
path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = '            // Hyperlink\n'
positions = []
idx = 0
while True:
    idx = text.find(marker, idx)
    if idx == -1:
        break
    positions.append(idx)
    idx += len(marker)
with open('debug_output.txt', 'w', encoding='utf-8') as f:
    f.write('positions=' + repr(positions) + '\n')
    if len(positions) >= 2:
        second = positions[1]
        cleanup = text.find('            // Remove extra spaces and blank lines\n', second)
        f.write('cleanup=' + repr(cleanup) + '\n')
        f.write('second_block=' + repr(text[second:cleanup]) + '\n')
    else:
        f.write('no second marker\n')
