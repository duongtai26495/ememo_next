
import Header from '@/components/Header'
import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useEffect } from 'react';
import { checkLoginUser } from '../utils/api_functions';



export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'vi'}];
}


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <main className='w-full flex flex-col lg:flex-row transition-all'>
          <Header />
          <div className='lg:pl-16'>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
