import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from './context/UserContext';
import ClientLayout from './components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sistema de Auditoría',
  description: 'Sistema de Auditoría SIFP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
