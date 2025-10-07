export default function KPI({ title, value }){
  return (
    <div className="kpi">
      <h3>{title}</h3>
      <div className="kpi-num">{value}</div>
    </div>
  );
}