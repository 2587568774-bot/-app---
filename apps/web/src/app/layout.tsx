import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'See Yunnan',
  description: 'Discover Yunnan county by county',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}