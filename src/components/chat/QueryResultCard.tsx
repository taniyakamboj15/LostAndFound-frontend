import { Search, FileText, Link2, Package, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import type { ChatQueryResult, ChatFoundItem, ChatLostReport, ChatMatch, ChatPickup } from '@app-types/chat.types';

// ─── Category Badge ────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
      {category.replace(/_/g, ' ')}
    </span>
  );
}

// ─── Confidence Bar ────────────────────────────────────────────────────────────

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-orange-400';
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] text-gray-500 font-medium">{score}% match</span>
    </div>
  );
}

// ─── Found Item Card ───────────────────────────────────────────────────────────

function FoundItemCard({ item }: { item: ChatFoundItem }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <CategoryBadge category={item.category} />
          <p className="text-xs text-gray-800 font-medium mt-1 line-clamp-2">{item.description}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">📍 {item.locationFound}</p>
          <p className="text-[10px] text-gray-400">📅 Found: {item.dateFound}</p>
        </div>
        <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
          item.status === 'AVAILABLE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {item.status}
        </span>
      </div>
    </div>
  );
}

// ─── Lost Report Card ──────────────────────────────────────────────────────────

function LostReportCard({ report }: { report: ChatLostReport }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm">
      <div className="flex items-start gap-2">
        <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <CategoryBadge category={report.category} />
          <p className="text-xs text-gray-800 font-medium mt-1 line-clamp-2">{report.description}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">📍 {report.locationLost}</p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-[10px] text-gray-400">Lost: {report.dateLost}</p>
            <p className="text-[10px] text-gray-300">ID: {report.id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Match Card ────────────────────────────────────────────────────────────────

function MatchCard({ match }: { match: ChatMatch }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm">
      <ConfidenceBar score={match.confidenceScore} />
      <div className="mt-1.5">
        <CategoryBadge category={match.item.category} />
        <p className="text-xs text-gray-800 font-medium mt-1 line-clamp-2">{match.item.description}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">📍 {match.item.locationFound}</p>
        <p className="text-[10px] text-gray-400">📅 Found: {match.item.dateFound}</p>
      </div>
    </div>
  );
}

// ─── Pickup Card ───────────────────────────────────────────────────────────────

function PickupCard({ pickup }: { pickup: ChatPickup }) {
  const statusIcon = pickup.isCompleted
    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
    : pickup.isVerified
    ? <Clock className="w-3.5 h-3.5 text-blue-500" />
    : <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />;

  const statusLabel = pickup.isCompleted ? 'Completed' : pickup.isVerified ? 'Verified' : 'Pending';
  const statusColor = pickup.isCompleted ? 'text-green-600' : pickup.isVerified ? 'text-blue-600' : 'text-yellow-600';

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1">
          {statusIcon}
          <span className={`text-[10px] font-semibold ${statusColor}`}>{statusLabel}</span>
        </div>
        <span className="text-[10px] font-mono bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
          {pickup.referenceCode}
        </span>
      </div>
      <CategoryBadge category={pickup.itemCategory} />
      <p className="text-xs text-gray-800 font-medium mt-1 line-clamp-1">{pickup.itemDescription}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">
        📅 {pickup.pickupDate} · {pickup.startTime}–{pickup.endTime}
      </p>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-3 text-center">
      <XCircle className="w-6 h-6 text-gray-300" />
      <p className="text-xs text-gray-500">{message}</p>
    </div>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────────

const RESULT_ICONS: Record<ChatQueryResult['type'], React.ReactNode> = {
  SEARCH_ITEMS: <Search className="w-3.5 h-3.5" />,
  MY_REPORTS: <FileText className="w-3.5 h-3.5" />,
  CHECK_MATCHES: <Link2 className="w-3.5 h-3.5" />,
  MY_PICKUPS: <Package className="w-3.5 h-3.5" />,
};

const RESULT_LABELS: Record<ChatQueryResult['type'], string> = {
  SEARCH_ITEMS: 'Found Items',
  MY_REPORTS: 'My Reports',
  CHECK_MATCHES: 'Matches',
  MY_PICKUPS: 'My Pickups',
};

// ─── Main Component ────────────────────────────────────────────────────────────

interface QueryResultCardProps {
  result: ChatQueryResult;
}

export default function QueryResultCard({ result }: QueryResultCardProps) {
  const isEmpty = result.total === 0;

  return (
    <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100/60 border-b border-indigo-100">
        <span className="text-indigo-600">{RESULT_ICONS[result.type]}</span>
        <span className="text-xs font-semibold text-indigo-700">{RESULT_LABELS[result.type]}</span>
        {!isEmpty && (
          <span className="ml-auto text-[10px] text-indigo-500 font-medium">{result.total} result{result.total !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-2 space-y-1.5 max-h-[260px] overflow-y-auto">
        {isEmpty ? (
          <EmptyState message={result.message} />
        ) : (
          <>
            {result.items?.map((item) => (
              <FoundItemCard key={item.id} item={item} />
            ))}
            {result.reports?.map((report) => (
              <LostReportCard key={report.id} report={report} />
            ))}
            {result.matches?.map((match) => (
              <MatchCard key={match.matchId} match={match} />
            ))}
            {result.pickups?.map((pickup) => (
              <PickupCard key={pickup.pickupId} pickup={pickup} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
