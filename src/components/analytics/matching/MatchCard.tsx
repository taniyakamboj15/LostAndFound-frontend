import { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Card, Badge, Button } from '@components/ui';
import { Match } from '@app-types/match.types';

/** Score breakdown bar component showing point contributions */
export const ScoreBar = ({ label, value, color = 'bg-blue-400' }: { label: string; value: number; color?: string }) => (
    <div className="flex items-center gap-2 text-xs">
        <span className="w-16 text-slate-500 text-right shrink-0">{label}</span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, (value / 50) * 100)}%` }} />
        </div>
        <span className="w-10 text-slate-600 font-bold shrink-0 text-right">+{value.toFixed(1)}</span>
    </div>
);

interface MatchCardProps {
    match: Match;
    onAction: (status: 'CONFIRMED' | 'REJECTED', id: string) => void;
}

const MatchCard = ({ match, onAction }: MatchCardProps) => {
    const { itemId, lostReportId, confidenceScore, status } = match;
    const [showBreakdown, setShowBreakdown] = useState(false);

    const getScoreColor = (score: number): "success" | "warning" | "default" => {
        if (score >= 85) return 'success';
        if (score >= 30) return 'warning';
        return 'default';
    };

    const scoreColorBar = (score: number) => {
        if (score >= 85) return 'bg-green-400';
        if (score >= 30) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    return (
        <Card className="overflow-hidden border-2 hover:border-blue-200 transition-colors">
            <div className="bg-slate-50 border-b pb-4 p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-lg">Match Found</h3>
                            <Badge variant={getScoreColor(confidenceScore)}>
                                {confidenceScore}/100 Confidence
                            </Badge>
                            {status !== 'PENDING' && (
                                <Badge variant={(status === 'CONFIRMED' || (status as string) === 'AUTO_CONFIRMED') ? 'success' : 'danger'}>
                                    {(status as string).replace('_', ' ')}
                                </Badge>
                            )}
                            {(status as string) === 'AUTO_CONFIRMED' && (
                                <span className="text-xs text-green-600 font-medium">⚡ Auto-confirmed</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">Created {format(new Date(match.createdAt), 'PPP p')}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                        {status === 'PENDING' && (
                            <>
                                <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" onClick={() => onAction('CONFIRMED', match._id)}>
                                    <Check className="w-4 h-4 mr-1" /> Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => onAction('REJECTED', match._id)}>
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </Button>
                            </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setShowBreakdown(v => !v)}>
                            {showBreakdown ? 'Hide' : 'Score Details'}
                        </Button>
                    </div>
                </div>

                {/* Score breakdown */}
                {showBreakdown && (
                    <div className="mt-3 p-3 bg-white rounded-md border space-y-1.5">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Score Breakdown</p>
                        <ScoreBar label="Category" value={match.categoryScore ?? 0} color={scoreColorBar(match.categoryScore ?? 0)} />
                        <ScoreBar label="Keywords" value={match.keywordScore ?? 0} color={scoreColorBar(match.keywordScore ?? 0)} />
                        <ScoreBar label="Date" value={match.dateScore ?? 0} color={scoreColorBar(match.dateScore ?? 0)} />
                        <ScoreBar label="Location" value={match.locationScore ?? 0} color={scoreColorBar(match.locationScore ?? 0)} />
                        <ScoreBar label="Features" value={match.featureScore ?? 0} color={scoreColorBar(match.featureScore ?? 0)} />
                        <ScoreBar label="Color" value={match.colorScore ?? 0} color={scoreColorBar(match.colorScore ?? 0)} />
                        <div className="border-t pt-1.5 mt-1">
                            <ScoreBar label="Total" value={confidenceScore} color={scoreColorBar(confidenceScore)} />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                {/* Found Item Side */}
                <div className="p-4 space-y-3 bg-white">
                    {itemId ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase text-blue-600 tracking-wider">Found Item</span>
                                <Badge variant="default">{itemId.category}</Badge>
                            </div>
                            <h3 className="font-medium text-lg text-slate-900">{itemId.description}</h3>
                            <div className="text-sm text-slate-600 grid gap-1">
                                <div>📍 {itemId.locationFound}</div>
                                <div>📅 {format(new Date(itemId.dateFound), 'PPP')}</div>
                            </div>
                            {itemId.photos && itemId.photos.length > 0 && (
                                <img
                                    src={`http://localhost:5000/${itemId.photos[0].path}`}
                                    alt="Item"
                                    className="w-full h-32 object-cover rounded-md mt-2 border"
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                            <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">Item Not Found</p>
                            <p className="text-[10px] mt-1 italic">This item may have been deleted.</p>
                        </div>
                    )}
                </div>

                {/* Lost Report Side */}
                <div className="p-4 space-y-3 bg-slate-50/50">
                    {lostReportId ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase text-amber-600 tracking-wider">Lost Report</span>
                                <Badge variant="default">{lostReportId.category}</Badge>
                            </div>
                            <h3 className="font-medium text-lg text-slate-900">{lostReportId.description}</h3>
                            <div className="text-sm text-slate-600 grid gap-1">
                                <div>📍 {lostReportId.locationLost}</div>
                                <div>📅 {format(new Date(lostReportId.dateLost), 'PPP')}</div>
                            </div>
                            <div className="mt-4 text-xs text-slate-500 pt-2 border-t">
                                Contact: {lostReportId.contactEmail}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                            <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">Report Not Found</p>
                            <p className="text-[10px] mt-1 italic">The report may have been withdrawn.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default MatchCard;
