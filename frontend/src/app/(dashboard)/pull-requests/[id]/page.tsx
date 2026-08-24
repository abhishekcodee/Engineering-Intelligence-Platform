import PullRequestDetailClient from './PullRequestDetailClient';

export function generateStaticParams() {
  return [
    { id: 'pr-1' },
    { id: 'pr-2' },
    { id: 'pr-3' },
    { id: 'pr-4' },
    { id: '1' },
    { id: '2' }
  ];
}

export default function PullRequestDetailPage({ params }: { params: { id: string } }) {
  return <PullRequestDetailClient id={params.id} />;
}
