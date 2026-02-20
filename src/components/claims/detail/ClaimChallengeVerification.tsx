import { ShieldAlert } from 'lucide-react';
import { Card, Button } from '@components/ui';
import { Claim } from '@/types/claim.types';

interface ClaimChallengeVerificationProps {
  claim: Claim;
  isAdmin: boolean;
  isStaff: boolean;
  isChallengeOpen: boolean;
  setIsChallengeOpen: (open: boolean) => void;
  challengeQuestion: string;
  setChallengeQuestion: (q: string) => void;
  handleSubmitChallengeQuestion: () => void;
  challengeLoadingId: string | null;
}

const ClaimChallengeVerification = ({
  claim,
  isAdmin,
  isStaff,
  isChallengeOpen,
  setIsChallengeOpen,
  challengeQuestion,
  setChallengeQuestion,
  handleSubmitChallengeQuestion,
  challengeLoadingId
}: ClaimChallengeVerificationProps) => {
  if (!(isAdmin || isStaff)) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-bold text-gray-900">Challenge-Response Verification</h2>
        <div className="h-px flex-1 bg-gray-100 ml-2" />
        <Button size="sm" variant="outline" onClick={() => setIsChallengeOpen(!isChallengeOpen)}>
          {isChallengeOpen ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {isChallengeOpen && (
        <Card className="p-6 space-y-4 bg-slate-50">
          <p className="text-sm text-slate-600">Ask the claimant a question whose answer only the true owner would know (e.g., a hidden serial number or a specific detail about the item). They will receive a notification and can answer it from their claim view.</p>
          
          {claim.itemId.secretIdentifiers && claim.itemId.secretIdentifiers.length > 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" /> Secret Identifiers
              </h4>
              <ul className="list-disc pl-5 text-xs text-amber-700">
                {claim.itemId.secretIdentifiers.map((secret, i) => (
                  <li key={i}>{secret}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Question asked</label>
            <input
              type="text"
              value={challengeQuestion}
              onChange={e => setChallengeQuestion(e.target.value)}
              placeholder="e.g. What is the serial number on the back of the laptop?"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitChallengeQuestion}
            disabled={challengeLoadingId === 'new' || !challengeQuestion.trim()}
          >
            {challengeLoadingId === 'new' ? 'Sending…' : 'Send Challenge'}
          </Button>
          
          {claim.challengeHistory && claim.challengeHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">Challenge History</p>
              {claim.challengeHistory.map((c, i) => (
                <div key={c._id || i} className={`text-sm p-3 mb-2 rounded-lg border ${
                  c.passed === true ? 'bg-green-50 border-green-200' :
                  c.passed === false ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                }`}>
                  <p className="font-medium text-gray-800">Q: {c.question}</p>
                  {c.answer ? (
                    <div className="mt-1">
                      <p className="text-gray-600">A: {c.answer}</p>
                      <p className={`text-xs mt-1 font-semibold ${c.passed ? 'text-green-700' : 'text-red-700'}`}>
                        Score: {c.matchScore}/100 — {c.passed ? 'Passed ✓' : 'Failed ✗'}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-amber-600 font-medium italic">Waiting for claimant to answer...</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </section>
  );
};

export default ClaimChallengeVerification;
