import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nova',
  description: 'Nova es una plataforma para compartir trabajos finales de grado y másteres',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" className='bg-dark'>
        <body className={inter.className}>
          <Navbar />
          <section className='mt-[100px]'>
          <Providers>{children}</Providers>
          </section>
          <footer>

          </footer>
          </body>
      </html>
  )
}
