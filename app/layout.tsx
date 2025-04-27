import { Providers } from './providers'

export const metadata = {
  title: 'Pregnancy Tracker',
  description: 'Track your pregnancy journey with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 