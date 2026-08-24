import DeveloperDetailClient from './DeveloperDetailClient';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: 'dev-1' },
    { id: 'dev-2' }
  ];
}

export default function DeveloperDetailPage({ params }: { params: { id: string } }) {
  return <DeveloperDetailClient id={params.id} />;
}
