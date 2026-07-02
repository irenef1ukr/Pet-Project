import { TopNav } from '../components/TopNav';
import './StubPage.css';

interface StubPageProps {
  title: string;
}

export function StubPage({ title }: StubPageProps) {
  return (
    <div className="page">
      <TopNav />
      <div className="stub-page">
        <span className="stub-page__title">{title}</span>
        <span className="stub-page__subtitle">This module hasn't been built yet.</span>
      </div>
    </div>
  );
}
