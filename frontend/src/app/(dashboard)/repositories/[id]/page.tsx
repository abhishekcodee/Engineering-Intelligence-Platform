import RepositoryDetailClient from './RepositoryDetailClient';

export function generateStaticParams() {
  return [
    { id: 'repo-live-1' },
    { id: '1' },
    { id: '2' },
    { id: 'repo-1' },
    { id: 'repo-2' }
  ];
}

export default function RepositoryDetailPage({ params }: { params: { id: string } }) {
  return <RepositoryDetailClient id={params.id} />;
}
