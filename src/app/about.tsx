import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us', // Will output as "About Us | My Awesome App"
  description: 'Learn more about our team and how we solve [Siedlervereinigung Siemens Nürnberg e.V. svs-nbg.de].',
};

export default function AboutPage() {
  return <div>...</div>;
}