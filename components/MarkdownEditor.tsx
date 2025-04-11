'use client'

import { ThemeKey, themes } from '@/lib/themes'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

export default function MarkdownEditor() {
    const [markdown, setMarkdown] = useState('## Hello Marksmith!\n\nWrite some **Markdown** here.')
    const [theme, setTheme] = useState<ThemeKey>('light')

    return (
        <><div className="ml-2 mt-2 mb-2">
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
        </div><div className="flex flex-col md:flex-row gap-4 h-screen p-4">
                <textarea
                    className="w-full md:w-1/2 h-full p-2 border rounded resize-none font-mono"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)} />
                {/* <div className="w-full md:w-1/2 h-full p-4 border rounded overflow-auto prose max-w-none"> */}
                <div className={`w-full md:w-1/2 h-full p-4 border rounded overflow-auto max-w-none ${themes[theme]}`}>
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
                            }
                        }} />
                </div>
            </div></>
    )
}
