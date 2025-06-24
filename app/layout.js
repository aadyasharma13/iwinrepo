import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthRouter from '@/components/auth/AuthRouter';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'I-Win Healthcare Community',
  description: 'Empowering healthcare journeys through authentic stories, community support, and shared experiences.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthRouter>
            {children}
          </AuthRouter>
        </AuthProvider>
      </body>
    </html>
  );
}