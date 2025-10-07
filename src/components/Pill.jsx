export default function Pill({ tone="base", children }){
  const cls = {
    base:"pill",
    orange:"pill pill-orange",
    yellow:"pill pill-yellow",
    red:"pill pill-red",
    green:"pill pill-green",
  }[tone] || "pill";
  return <span className={cls}>{children}</span>;
}