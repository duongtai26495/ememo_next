
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'vi'}];
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({children, params}:{
  children: React.ReactNode,
  params : any
}) {
 
  return (
    <html lang={params.locale}>
      <body className={inter.className}>
        {children}
        <select
          id="lang"
          name="lang"
          className="absolute top-2 right-2 px-4 py-2 border rounded text-sm"
          required>
          <option
            value={"en"}
            defaultChecked>
            English
          </option>
          <option value={"vi"}>
            Vietnamese
          </option>
        </select>
      </body>
    </html>
  )
}