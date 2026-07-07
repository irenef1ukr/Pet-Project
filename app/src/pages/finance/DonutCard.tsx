import './DonutCard.css';

interface LegendItem {
  name: string;
  dotColor: string;
  pctLabel: string;
}

interface DonutCardProps {
  legend: LegendItem[];
  gradient: string;
  centerValue: string;
  centerLabel: string;
}

export function DonutCard({ legend, gradient, centerValue, centerLabel }: DonutCardProps) {
  return (
    <div className="finance-card donut-card">
      <div className="donut-card__ring" style={{ background: gradient }}>
        <div className="donut-card__hole">
          <div className="donut-card__value">{centerValue}</div>
          <div className="donut-card__label">{centerLabel}</div>
        </div>
      </div>
      <div className="donut-card__legend">
        {legend.map((item) => (
          <div key={item.name} className="donut-card__legend-row">
            <div className="donut-card__dot" style={{ background: item.dotColor }} />
            <span className="donut-card__legend-name">{item.name}</span>
            <span className="donut-card__legend-pct">{item.pctLabel}</span>
          </div>
        ))}
        {legend.length === 0 && <div className="donut-card__empty">No spending in this period yet</div>}
      </div>
    </div>
  );
}
