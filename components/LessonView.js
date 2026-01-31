
import { useEffect, useState } from 'react';
import CodeEditor from './CodeEditor';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export default function LessonView({ title, content }) {
  const [parsedSections, setParsedSections] = useState([]);

  useEffect(() => {
    if (!content) return;

    const sections = [];
    let currentText = [];
    // 0. Pre-process / Clean the raw text
    // Fix broken tags like "< h1" -> "<h1>" caused by scraping artifacts
    // 0. Pre-process / Clean the raw text
    // Refined Strategy: Escape broken tags so they show as code/text, don't try to make them execute.
    let cleanContent = content
        .replace(/<\n/g, '&lt;')   // Escape start of broken tag
        .replace(/\n>/g, '&gt;')   // Escape end of broken tag
        .replace(/<\s+\/\s+/g, '&lt;/') // Escape broken closing tag start
        .replace(/\n{3,}/g, '\n\n'); // Normalize insane newlines

    const lines = cleanContent.split('\n');
    let isCollectingCode = false;
    let codeBuffer = [];

    // Known structural headers that deserve H3
    // Known structural headers that deserve H3
    const KNOWN_HEADERS = ['Example Explained', 'What is', 'Note', 'Tip', 'Syntax', 'Parameter Values', 'Browser Support', 'Definition and Usage', 'Tips and Notes', 'Chapter Summary', 'HTML Exercises'];

    // Detect if this is a "List Page" (like HTML Examples) vs a "Content Page" (like HTML Attributes)
    // List pages should have bullet points for sub-items, while Lessons should have Headers.
    const isListPage = title && (title.toLowerCase().endsWith('examples') || title.toLowerCase().includes('reference') || title.toLowerCase().includes('quiz'));

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const trimmed = line.trim();

        // Skip artifact lines
        if (trimmed === 'none') continue;

        // --- HEURISTICS TO FLUSH CODE BLOCK ---
        // If we are collecting code, but we hit something that clearly ISN'T code, flush it.
        if (isCollectingCode) {
            const isNewExample = /^(?:[\w\s.]+\s)?Example:?$/i.test(trimmed);
            const isHeader = (trimmed.length < 60 && /^[A-Z]/.test(trimmed) && !/[<>{};=]/.test(trimmed)) || KNOWN_HEADERS.some(h => trimmed.includes(h));
            // Text Heuristic: Long line, starts with Capital, doesn't start with code chars like <, {, function, var
            const isPlainText = trimmed.length > 40 && /^[A-Z]/.test(trimmed) && !trimmed.startsWith('<') && !trimmed.startsWith('import ') && !trimmed.includes('{');

            // Force close if we hit a delimiter OR a new section
            if (isNewExample || (isHeader && trimmed !== 'Try it Yourself »') || isPlainText) {
                 // Determine language
                 let lang = 'html';
                 const codeStr = codeBuffer.join('\n');
                 if (codeStr.includes('import ') || codeStr.includes('const ') || codeStr.includes('console.log') || codeStr.includes('public class')) lang = 'javascript';
                 if (codeStr.includes('{') && codeStr.includes('}') && !codeStr.includes('<')) lang = 'css';
                 if (codeStr.includes('def ') || codeStr.includes('print(')) lang = 'python';

                 if (codeStr.trim().length > 0) {
                    sections.push({ type: 'code', content: codeStr, language: lang });
                 }
                 codeBuffer = [];
                 isCollectingCode = false;
                 // Don't continue here, we want to process this line as text/header below
            }
        }
        // --------------------------------------

        // Heuristic: Start of a Code Block
        // Detect "Example", "Java Example", "HTML Example", "HTML Example:" etc.
        if (/^(?:[\w\s.]+\s)?Example:?$/i.test(trimmed)) {
            if (currentText.length > 0) {
                sections.push({ type: 'text', content: currentText.join('\n') });
                currentText = [];
            }
            isCollectingCode = true;
            continue;
        }

        // Heuristic: End of a Code Block (Explicit)
        if (trimmed === 'Try it Yourself »' || trimmed === 'Try it Yourself' || trimmed === 'Run Example »') {
            if (isCollectingCode) {
                // Determine language based on content
                let lang = 'html';
                const codeStr = codeBuffer.join('\n');
                if (codeStr.includes('import ') || codeStr.includes('const ') || codeStr.includes('console.log') || codeStr.includes('public class')) lang = 'javascript';
                if (codeStr.includes('{') && codeStr.includes('}') && !codeStr.includes('<')) lang = 'css';
                if (codeStr.includes('def ') || codeStr.includes('print(')) lang = 'python';

                sections.push({ type: 'code', content: codeStr, language: lang });
                codeBuffer = [];
                isCollectingCode = false;
            }
            continue;
        }

        // Clean up v4 specific noise
        if (
            trimmed.startsWith('Running...') || 
            trimmed === 'Submit Answer »' || 
            trimmed === 'Start the Exercise' ||
            trimmed.includes('in the sequence listed in the left menu') ||
            trimmed.includes('sequence listed in the menu') ||
            trimmed.startsWith('See all') ||
            (trimmed.startsWith('Start ') && trimmed.endsWith(' Quiz')) ||
            trimmed === 'Go to CSS Examples!' ||
            trimmed === 'Go to W3.JS Examples!'
        ) continue;

        if (isCollectingCode) {
            codeBuffer.push(line);
        } else {
            // Improve formatting for Markdown processing
            
            // 1. Detect Headers: Short lines that are capitalized
            const isTitleCase = /^[A-Z][a-zA-Z0-9\s]+$/.test(trimmed);
            const isShort = trimmed.length > 2 && trimmed.length < 60;
            const hasPunctuation = /[.:;]$/.test(trimmed);
            
            if (isShort && !hasPunctuation && (isTitleCase || /^[A-Z]/.test(trimmed))) {
                 if (!trimmed.startsWith('#')) {
                     // Check if it's a known structural header or just a label
                     const isKnown = KNOWN_HEADERS.some(h => trimmed.includes(h));
                     
                     // IMPROVED HEURISTIC: content-specific patterns for headers
                     const isHTMLHeader = trimmed.startsWith('HTML ') && !trimmed.includes('Example');
                     const isAttributeHeader = /^The .* Attributes?$/i.test(trimmed);
                     const isTagHeader = /^The .* tag$/i.test(trimmed);

                     if (isKnown || trimmed.endsWith('Explained') || trimmed.endsWith('Reference')) {
                        currentText.push(`### ${trimmed}`); 
                     } 
                     else if (isHTMLHeader) {
                         // "HTML ..." is a header usually
                         currentText.push(`### ${trimmed}`);
                     }
                     else if (isAttributeHeader || isTagHeader) {
                         // On List Lists (Examples), these are Sub-Items. On Lessons, they are Headers.
                         if (isListPage) {
                             currentText.push(`- ${trimmed}`);
                         } else {
                             currentText.push(`### ${trimmed}`);
                         }
                     }
                     else {
                        // Fallback: If it looks like a list item (very short, starts with HTML), make it list.
                        // Otherwise if it's just a short bold phrase, make it bold.
                        currentText.push(`**${trimmed}**`);
                     }
                 } else {
                     currentText.push(line);
                 }
            } 
            // 2. Detect Lists: "•" or "-"
            else if (trimmed.startsWith('•') || trimmed.startsWith('- ')) {
                 currentText.push(line.replace('•', '-'));
            }
            else {
                currentText.push(line);
            }
        }
    }

    // Flush remaining
    if (currentText.length > 0) {
        sections.push({ type: 'text', content: currentText.join('\n') });
    }
    if (codeBuffer.length > 0) {
        sections.push({ type: 'code', content: codeBuffer.join('\n'), language: 'html' });
    }

    setParsedSections(sections);
  }, [content]);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-slate-100 font-sans">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-10 tracking-tight leading-tight border-b border-slate-100 pb-8">{title}</h1>
      
      <div className="space-y-8">
        {parsedSections.map((section, idx) => {
          if (section.type === 'code') {
            return (
                <div key={idx} className="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interactive {section.language} Editor</span>
                    </div>
                    <CodeEditor initialCode={section.content} language={section.language} />
                </div>
            );
          }
          
          // Render Markdown
          const htmlContent = DOMPurify.sanitize(marked.parse(section.content));
          return (
            <div 
                key={idx} 
                className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-bold prose-headings:text-slate-800 
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-li:text-slate-600 prose-ul:list-disc prose-ul:pl-6
                    prose-strong:text-indigo-700 prose-strong:font-bold
                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-500
                "
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          );
        })}
      </div>
    </div>
  );
}
