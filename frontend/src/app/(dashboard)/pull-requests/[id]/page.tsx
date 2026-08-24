import PullRequestDetailClient from './PullRequestDetailClient';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: 'pr-1' },
    { id: 'pr-2' }
  ];
}

export default function PullRequestDetailPage({ params }: { params: { id: string } }) {
  return <PullRequestDetailClient id={params.id} />;
}
