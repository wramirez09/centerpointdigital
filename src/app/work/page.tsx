import CenterpointWorkPage from './CenterpointWorkPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work | Center Point Digital',
  description: 'Selected projects — web design, mobile apps, branding, SEO, UI/UX, and social media work shipped by CenterPoint Digital.',
};

export default function WorkPage() {
  return <CenterpointWorkPage />;
}
