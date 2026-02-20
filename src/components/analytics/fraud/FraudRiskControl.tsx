import { Card, Button } from '@components/ui';

interface FraudRiskControlProps {
  inputThreshold: string | number;
  setInputThreshold: (val: string) => void;
  applyThreshold: () => void;
  totalClaims: number;
  threshold: number;
}

const FraudRiskControl = ({
  inputThreshold,
  setInputThreshold,
  applyThreshold,
  totalClaims,
  threshold
}: FraudRiskControlProps) => {
  return (
    <Card className="p-4 mb-6 flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium text-slate-700">Risk Threshold:</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={inputThreshold}
          onChange={e => setInputThreshold(e.target.value)}
          className="w-40 accent-red-500"
        />
        <input
          type="number"
          value={inputThreshold}
          onChange={e => setInputThreshold(e.target.value)}
          className="w-16 border rounded px-2 py-1 text-sm text-center"
          min={0}
          max={100}
        />
      </div>
      <Button size="sm" variant="primary" onClick={applyThreshold}>Apply</Button>
      <span className="text-sm text-slate-500 ml-auto">
        Showing {totalClaims ?? '–'} high-risk claim(s) ≥ {threshold}
      </span>
    </Card>
  );
};

export default FraudRiskControl;
