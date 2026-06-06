const fs = require('fs');
function escapeHtml(text) {
  const map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#039;'};
  return text.replace(/[&<>"']/g, m => map[m]);
}
function convertMarkdown(markdown) {
  let md = markdown;
  const codeBlocks=[];
  md = md.replace(/```([\s\S]*?)```/g,(m,code)=>{const p=`___CODE_BLOCK_${codeBlocks.length}___`;codeBlocks.push(code);return p;});
  const inlineCode=[];
  md=md.replace(/`([^`\n]+?)`/g,(m,code)=>{const p=`___INLINE_CODE_${inlineCode.length}___`;inlineCode.push(code);return p;});
  const lines = md.split(/\r?\n/);
  const outputLines=[];
  let currentList=null;
  let listItems=[];
  let blockquoteLines=[];
  let tableState=null;
  const flushList=()=>{
    if (!currentList) return;
    const wrapper = currentList === 'ol' ? 'ol' : 'ul';
    outputLines.push(`<${wrapper}>${listItems.join('')}</${wrapper}>`);
    currentList = null;
    listItems = [];
  };
  const flushBlockquote=()=>{
    if (!blockquoteLines.length) return;
    const content = blockquoteLines.map(line => renderInline(line)).join('<br />');
    outputLines.push(`<blockquote style="border-left: 4px solid #7C3AED; padding-left: 16px; margin-left: 0; color: #6b7280;">${content}</blockquote>`);
    blockquoteLines = [];
  };
  const flushTable=()=>{
    if (!tableState) return;
    const { header, rows } = tableState;
    const headerHtml = header.map(cell => `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${escapeHtml(cell)}</th>`).join('');
    const bodyHtml = rows.map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #ddd; padding: 8px;">${escapeHtml(cell)}</td>`).join('')}</tr>`).join('');
    outputLines.push(`<table style="border-collapse: collapse; width: 100%;"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`);
    tableState = null;
  };
  const parseTableRow = line => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
  const isTableLine = line => /^\s*\|?(?:[^|]+\|)+[^|]*\|?\s*$/.test(line);
  const isTableSeparator = line => /^\s*\|?\s*[:-]+(?:\s*\|\s*[:-]+)*\s*\|?\s*$/.test(line);
  const isHtmlBlock = line => /^\s*<\/?(h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|blockquote|pre|code|hr|img|div|p|span|section|article|header|footer|figure|figcaption|details|summary|script|style)(\s|>|$)/i.test(line);
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const nextLine = lines[i + 1] || '';
    const line = rawLine.replace(/\r?\n$/, '');
    const trimmed = line.trim();
    if (trimmed === '') {
      flushList();
      flushBlockquote();
      flushTable();
      outputLines.push('');
      continue;
    }
    if (/^\s*>/.test(line)) {
      flushList();
      flushTable();
      blockquoteLines.push(line.replace(/^\s*>\s?/, ''));
      continue;
    }
    if (!tableState && isTableLine(line) && isTableSeparator(nextLine)) {
      flushList();
      flushBlockquote();
      tableState = { header: parseTableRow(line), rows: [] };
      i += 1;
      continue;
    }
    if (tableState && isTableLine(line)) {
      tableState.rows.push(parseTableRow(line));
      continue;
    }
    if (tableState) {
      flushTable();
    }
    const taskMatch = line.match(/^\s*([-+*]|\d+\.)\s*\[([ xX])\]\s+(.+)$/);
    const ulMatch = line.match(/^\s*([-+*])\s+(.+)$/);
    const olMatch = line.match(/^\s*(\d+)\.\s+(.+)$/);
    if (taskMatch || ulMatch || olMatch) {
      flushBlockquote();
      const itemText = taskMatch ? taskMatch[3] : (ulMatch ? ulMatch[2] : olMatch[2]);
      const itemHtml = renderInline(itemText);
      if (taskMatch) {
        const checked = taskMatch[2].toLowerCase() === 'x' ? 'checked' : '';
        if (currentList !== 'ul') flushList();
        currentList = 'ul';
        listItems.push(`<li><label style="cursor: default;"><input type="checkbox" ${checked} disabled /> ${itemHtml}</label></li>`);
        continue;
      }
      if (ulMatch) {
        if (currentList !== 'ul') flushList();
        currentList = 'ul';
        listItems.push(`<li>${itemHtml}</li>`);
        continue;
      }
      if (olMatch) {
        if (currentList !== 'ol') flushList();
        currentList = 'ol';
        listItems.push(`<li>${itemHtml}</li>`);
        continue;
      }
    }
    flushList();
    flushBlockquote();
    const headingMatch = line.match(/^\s*(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      outputLines.push(`<h${level}>${renderInline(headingMatch[2].trim())}</h${level}>`);
      continue;
    }
    if (/^\s*[-*_]{3,}\s*$/.test(line)) {
      outputLines.push('<hr />');
      continue;
    }
    if (isHtmlBlock(line)) {
      outputLines.push(line);
      continue;
    }
    outputLines.push(`<p>${renderInline(line)}</p>`);
  }
  flushList();
  flushBlockquote();
  flushTable();
  let html = outputLines.join('\n');
  codeBlocks.forEach((code, index) => {
    const rawCode = code.replace(/^\n+|\n+$/g, '');
    const langMatch = rawCode.match(/^([a-zA-Z0-9_-]+)\s*\n([\s\S]*)$/);
    const language = langMatch ? langMatch[1] : '';
    const codeContent = langMatch ? langMatch[2] : rawCode;
    html = html.replace(
      `___CODE_BLOCK_${index}___`,
      `<pre><code class="language-${language}">${escapeHtml(codeContent)}</code></pre>`
    );
  });
  inlineCode.forEach((code, index) => {
    html = html.replace(
      `___INLINE_CODE_${index}___`,
      `<code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.9em;">${escapeHtml(code)}</code>`
    );
  });
  html = html.replace(/\n{3,}/g, '\n\n');
  return html.trim();
  function renderInline(text) {
    if (!text) return '';
    return text
      .replace(/!\[([^\]]*?)\]\(([^)]+?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      .replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/==(.+?)==/g, '<mark>$1</mark>')
      .replace(/\^(.+?)\^/g, '<sup>$1</sup>')
      .replace(/(?<!~)~(?!~)(.+?)(?<!~)~(?!~)/g, '<sub>$1</sub>')
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>');
  }
}
const test = `# Heading 1

Some **bold** and *italic* text.

## Heading 2

- Item one
- Item two
1. Ordered one
2. Ordered two

- [x] Done task
- [ ] Open task

> A blockquote line 1
> line 2 continues

| Header 1 | Header 2 |
| --- | --- |
| cell 1 | cell 2 |
| cell 3 | cell 4 |


test \`inline code\` and code block:


test code line 1
line 2
```
console.log('hello');
```

Final line
`;
fs.writeFileSync('test-parser-output.txt', convertMarkdown(test));
