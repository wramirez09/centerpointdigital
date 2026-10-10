import CenterpointPage from './CenterpointPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Center Point Digital | Custom Software Development, Design & Digital Marketing Solutions',
  description: 'Center Point Digital | Custom Software Development, Design & Digital Marketing Solutions',
  openGraph: {
    images: ['./images/hero/draw.svg'],
  },
};

export default function Home() {
  return <CenterpointPage />;
}
