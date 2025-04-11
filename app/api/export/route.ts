import { NextRequest } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(req: NextRequest) {
  const { html } = await req.json()

  console.log('Received HTML:', html)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  await page.setContent(html, {
    waitUntil: 'networkidle0',
  })

  const pdf = await page.pdf({
    format: 'A4',
    // margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    printBackground: true,
  })

  await browser.close()

  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="marksmith.pdf"',
    },
  })
}
