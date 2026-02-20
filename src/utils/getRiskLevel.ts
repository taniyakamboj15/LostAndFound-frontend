export const getRiskLevel = (score: number): { label: string; color: 'danger' | 'warning' | 'default' } => {
  if (score >= 85) return { label: 'CRITICAL', color: 'danger' };
  if (score >= 70) return { label: 'HIGH', color: 'danger' };
  return { label: 'MODERATE', color: 'warning' };
};
