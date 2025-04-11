'use client'

import remarkGfm from 'remark-gfm'
import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { ThemeKey, themes } from '@/lib/themes'
import { fonts } from '@/lib/fonts'

export default function MarkdownEditor() {
    const [markdown, setMarkdown] = useState('## Hello Marksmith!\n\nWrite some **Markdown** here.')
    const [theme, setTheme] = useState<ThemeKey>('light')
    const [font, setFont] = useState('Inter')
    const [loading, setLoading] = useState(false)
    const previewRef = useRef<HTMLDivElement>(null)

    const handleExport = async () => {
        const preview = previewRef.current
        if (!preview) return

        const htmlContent = preview.outerHTML
        const fontURLMap: Record<string, string> = {
            Inter: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
            Roboto: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
            "Fira Code": "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
            "JetBrains Mono": "https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap",
            Georgia: "", // Georgia is system font
        }
        const fontLink = fontURLMap[font]

        const html = `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">
          ${fontLink ? `<link href="${fontLink}" rel="stylesheet">` : ''}
          <style>
            body {
              background-color: ${theme === 'dark' ? '#111827' : '#ffffff'};
              color: ${theme === 'dark' ? '#ffffff' : '#000000'};
                font-family: ${fonts[font as keyof typeof fonts]};
            }
            .prose pre, .prose code {
              background-color: ${theme === 'dark' ? '#1f2937' : '#f5f5f5'};
              color: ${theme === 'dark' ? '#d1d5db' : '#111827'};
            }
            @media print {
                body {
                    margin: 0;
                }
                h1, h2, h3, p, pre, code {
                    page-break-inside: avoid;
                }
                pre {
                    white-space: pre-wrap;
                    word-break: break-word;
                }
            }
            @page {
                margin: 2cm;
                background: ${theme === 'dark' ? '#111827' : '#ffffff'};
            }
          </style>
        </head>
        <body class="${themes[theme]}">
          ${htmlContent}
        </body>
      </html>
    `

        setLoading(true)
        try {
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
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen p-4 flex flex-col gap-4">
            <style>
                {`
                    .markdown-body {
                    font-family: ${fonts[font as keyof typeof fonts]};
                    line-height: 1.6;
                    }

                    .markdown-body h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 1em 0 0.5em;
                    }

                    .markdown-body h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 1em 0 0.5em;
                    }

                    .markdown-body h3 {
                    font-size: 1.25em;
                    font-weight: bold;
                    margin: 1em 0 0.5em;
                    }

                    .markdown-body p {
                    margin: 0.75em 0;
                    }

                    .markdown-body code {
                    background: #eee;
                    padding: 0.2em 0.4em;
                    border-radius: 4px;
                    }

                    .markdown-body pre {
                    background: #111827;
                    color: white;
                    padding: 1em;
                    border-radius: 6px;
                    overflow: auto;
                    }
                `}
            </style>
            {/* Theme + Export Controls */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Theme Selector */}
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

                    {/* Font Selector */}
                    <div>
                        <label className="mr-2 font-medium">Font:</label>
                        <select
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            className="border px-2 py-1 rounded min-w-[160px]"
                        >
                            {Object.keys(fonts).map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleExport}
                    disabled={loading}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>}
                    {loading ? 'Exporting...' : 'Export to PDF'}
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
                    style={{ fontFamily: fonts[font as keyof typeof fonts] }}
                    className={`w-full md:w-1/2 h-full p-4 border rounded overflow-auto max-w-none prose markdown-body ${themes[theme]}`}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
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
