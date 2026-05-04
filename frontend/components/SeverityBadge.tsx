type Severity = "low" | "medium" | "high" | null | undefined;

const styles: Record<string, string> = {
  low: "bg-green-50 text-green-700 border border-green-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  high: "bg-red-50 text-red-700 border border-red-200",
};

export default function SeverityBadge({ severity }: { severity: Severity }) {
  if (!severity) return <span className="text-gray-400">—</span>;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[severity] ?? ""}`}>
      {severity.toUpperCase()}
    </span>
  );
}
