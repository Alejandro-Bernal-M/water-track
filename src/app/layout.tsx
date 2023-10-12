import './globals.css'
import { Toaster } from 'react-hot-toast'
import Providers from './Providers'
import Navbar from '@/components/Navbar'

export const metadata = {
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
      <body >
        <Toaster />
        <Providers>
          <Navbar />
          {children}
        </Providers>
        </body>
    </html>
  )
}
