import { Inter } from "next/font/google"

const inter = Inter({
  subsets:["latin"],
  weight:["400","500","600"]
})

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}