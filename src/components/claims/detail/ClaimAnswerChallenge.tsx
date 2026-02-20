import { AlertTriangle } from 'lucide-react';
import { Card, Button } from '@components/ui';
import { Claim } from '@/types/claim.types';

interface ClaimAnswerChallengeProps {
  claim: Claim;
  isClaimant: boolean;
  challengeAnswers: Record<string, string>;
  setChallengeAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleSubmitChallengeAnswer: (id: string) => void;
  challengeLoadingId: string | null;
}

const ClaimAnswerChallenge = ({
  claim,
  isClaimant,
  challengeAnswers,
  setChallengeAnswers,
  handleSubmitChallengeAnswer,
  challengeLoadingId
}: ClaimAnswerChallengeProps) => {
  if (!isClaimant || !claim.challengeHistory?.some((c) => !c.answer)) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
         <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
           <AlertTriangle className="h-5 w-5 text-amber-500" />
           Action Required: Answer Challenge
         </h2>
         <div className="h-px flex-1 bg-gray-100 ml-2" />
      </div>
      <Card className="p-6 space-y-4 border-2 border-amber-200 bg-amber-50">
        <p className="text-sm text-slate-700 font-medium">Please answer the following security question(s) to verify your claim.</p>
        {claim.challengeHistory.filter(c => !c.answer).map((c) => (
          <div key={c._id} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
            <p className="font-bold text-gray-900 mb-2">Question: {c.question}</p>
            <input
              type="text"
              value={challengeAnswers[c._id] || ''}
              onChange={e => setChallengeAnswers(prev => ({ ...prev, [c._id]: e.target.value }))}
              placeholder="Type your answer here..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <Button
              variant="primary"
              size="sm"
              className="mt-3 bg-amber-500 hover:bg-amber-600 border-none w-full"
              onClick={() => handleSubmitChallengeAnswer(c._id)}
              disabled={challengeLoadingId === c._id || !(challengeAnswers[c._id]?.trim())}
            >
              {challengeLoadingId === c._id ? 'Submitting…' : 'Submit Answer'}
            </Button>
          </div>
        ))}
      </Card>
    </section>
  );
};

export default ClaimAnswerChallenge;
