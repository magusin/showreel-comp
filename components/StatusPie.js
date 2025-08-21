// Composant client unique (pas de SSR)
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatusPie({ data, colorsMap }) {
  // on ne garde que les statuts avec value > 0
  const cleaned = (data || []).filter(d => (d?.value ?? 0) > 0);

  if (!cleaned.length) {
    return <p className="text-sm text-gray-500">Aucune donnée à afficher.</p>;
  }

  return (
    <div style={{ width: 400, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={cleaned} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
            {cleaned.map((d, i) => (
              <Cell key={`${d.name}-${i}`} fill={colorsMap?.[d.name] || '#999'} />
            ))}
        </Pie>
        <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
