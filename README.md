**Project Name:** Marksmith

**Description:**
Marksmith is a minimal web-based tool that lets users write, style, and export Markdown as beautifully formatted PDFs. With optional account creation, users can save documents, revisit past exports, and share them as public links.

---

## Software Requirements Specification (SRS)

### 1. Goals and Scope
- Allow users to paste or write Markdown.
- Live preview of the styled Markdown.
- Export as PDF using selectable themes.
- (Optional) Log in to save, manage, and share documents.

### 2. User Roles
- **Anonymous User**: Use editor, export PDF.
- **Authenticated User**: Save documents, view history, edit/delete, share public links.

### 3. Core Features (MVP)
- [x] Markdown editor with live preview
- [x] PDF export (html2pdf.js)
- [x] Theme selector (3 presets)
- [x] Auth (NextAuth: Google & GitHub)
- [x] Save/load user documents
- [x] Document listing & management

### 4. Optional/Beta Features
- [ ] Public shareable links
- [ ] Dark mode toggle
- [ ] Table of contents in export
- [ ] Custom themes for pro users

### 5. Tech Stack
- **Frontend**: Next.js, TailwindCSS
- **Editor**: react-markdown, react-syntax-highlighter
- **PDF Export**: html2pdf.js
- **Auth**: NextAuth.js
- **Database**: Prisma + SQLite (upgradeable to Postgres)
- **Deployment**: Vercel

---

## Timeline (5 Days Plan)

### Day 1: Markdown Editor & Export
- Setup project, install core deps
- Implement Markdown editor with live preview
- Add static theme selector
- Export to PDF with basic styling

### Day 2: Theme Support & Polish
- Add 2 more themes
- Style PDF output
- Refactor for cleaner state management

### Day 3: Auth & Database
- Integrate NextAuth (Google & GitHub)
- Setup Prisma models: User, Document
- Enable save/load document for logged-in users

### Day 4: Document Dashboard
- Create user dashboard (list, edit, delete docs)
- Hook up frontend with DB actions
- Implement delete confirmation

### Day 5: Sharing & Final Polish
- Add public link sharing (simple slug URL)
- Basic UI cleanup (dark mode, button states)
- Deploy to Vercel
- Create landing page with description/demo

---

## Naming & Branding
**Name:** Marksmith  
**Tagline:** "Craft your Markdown. Share it. Print it beautifully."
**Logo Idea:** Simple quill or markdown symbol + print icon combo

---

