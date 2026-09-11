import './globals.css';
import Providers from '@/components/providers';
export const metadata = {
  title: 'Elevate Sports | A love of movement starts here',
  description: 'Helping young people build a positive, lasting relationship with movement through basketball, sport and games they enjoy.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }) {
  return <html lang="en-GB"><body><Providers>{children}</Providers></body></html>;
}
