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
          <section className='pt-[100px]'>
            <Providers>{children}</Providers>
          </section>
          <footer className='bg-dark text-white text-center py-3'>
          <p>© 2021 Nova</p>
          </footer>
          </body>
      </html>
  )
}
