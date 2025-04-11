'use client'

import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { ThemeKey, themes } from '@/lib/themes'

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('## Hello Marksmith!\n\nWrite some **Markdown** here.')
  const [theme, setTheme] = useState<ThemeKey>('light')
  const previewRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    const preview = previewRef.current
    if (!preview) return

    const htmlContent = preview.outerHTML

    const html = `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body {
              padding: 2rem;
              background-color: ${theme === 'dark' ? '#111827' : '#ffffff'};
              color: ${theme === 'dark' ? '#ffffff' : '#000000'};
              font-family: 'Inter', sans-serif;
            }
            .prose pre, .prose code {
              background-color: ${theme === 'dark' ? '#1f2937' : '#f5f5f5'};
              color: ${theme === 'dark' ? '#d1d5db' : '#111827'};
            }
          </style>
        </head>
        <body class="${themes[theme]}">
          ${htmlContent}
        </body>
      </html>
    `

    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    })

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'marksmith.pdf'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-screen p-4 flex flex-col gap-4">
      {/* Theme + Export Controls */}
      <div className="flex items-center gap-4">
        <div>
          <label className="mr-2 font-medium">Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeKey)}
            className="border px-2 py-1 rounded"
          >
            {Object.keys(themes).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Export to PDF
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <textarea
          className="w-full md:w-1/2 h-full p-2 border rounded resize-none font-mono"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div
          ref={previewRef}
          className={`w-full md:w-1/2 h-full p-4 border rounded overflow-auto max-w-none prose ${themes[theme]}`}
        >
          <ReactMarkdown
            children={markdown}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomOneLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
