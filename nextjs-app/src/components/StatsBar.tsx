'use client';

interface Stat {
  label: string;
  value: number | string;
  italic?: boolean;
}

interface StatsBarProps {
  stats: Stat[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="stats-bar">
      {stats.map((stat, i) => (
        <div key={i} className="stat-widget">
          <span className="stat-label">{stat.label}</span>
          <span className={`stat-value${stat.italic ? ' stat-value--italic' : ''}`}>
            {stat.value}
          </span>
        </div>
      ))}

      <style jsx>{`
        .stats-bar {
          display: flex;
          align-items: flex-start;
          gap: 0;
          width: 100%;
          padding-bottom: var(--u-space-two, 32px);
        }

        .stat-widget {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-right: var(--u-space-two, 32px);
        }

        .stat-widget:last-child {
          padding-right: 0;
        }

        .stat-label {
          font-family: var(--font-barlow), 'Barlow', sans-serif;
          font-size: var(--u-font-size-150, 14px);
          font-weight: 600;
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1.2;
        }

        .stat-value {
          font-family: var(--font-barlow), 'Barlow', sans-serif;
          font-size: 40px;
          font-weight: 700;
          font-style: normal;
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1;
        }

        .stat-value--italic {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
