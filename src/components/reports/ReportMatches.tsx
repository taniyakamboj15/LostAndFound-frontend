import { Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Card, Badge, Button, Spinner } from '@components/ui';
import { Match } from '../../types/match.types';
import { getConfidenceBadge } from '@utils/ui';
import { formatDate } from '@utils/formatters';
import { motion } from 'framer-motion';

interface ReportMatchesProps {
  matches: Match[];
  isLoading: boolean;
}

const ReportMatches = ({ matches, isLoading }: ReportMatchesProps) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <Card className="border-none shadow-xl shadow-gray-100/50 bg-white overflow-hidden rounded-3xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Potential Matches
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Found automated system matches</p>
          </div>
          {matches.length > 0 && (
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
               <TrendingUp className="h-4 w-4 text-green-600" />
               <span className="text-sm font-bold text-green-700">{matches.length} Matches</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-12 gap-3">
            <Spinner size="md" />
            <p className="text-sm font-medium text-gray-400 animate-pulse">Running match engine...</p>
          </div>
        ) : matches.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {matches.map((match: Match) => {
              const confidenceBadge = getConfidenceBadge(match.confidenceScore);
              const scorePercent = (match.confidenceScore * 100).toFixed(0);
              
              return (
                <motion.div
                  key={match._id}
                  variants={itemVariants}
                  className="group relative border border-gray-100 rounded-2xl p-4 hover:border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Item Photo thumbnail */}
                    <div className="w-full sm:w-32 sm:h-32 aspect-square bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                      {match.itemId?.photos && match.itemId.photos.length > 0 ? (
                        <img
                          src={match.itemId.photos[0].path.startsWith('http') ? match.itemId.photos[0].path : `${apiUrl}/${match.itemId.photos[0].path}`}
                          alt="Item thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-10 h-10 stroke-[1.5]" />
                        </div>
                      )}
                      
                      {/* Confidence Overlay (mobile focus) */}
                      <div className="absolute top-2 left-2 sm:hidden">
                         <Badge variant={confidenceBadge.variant} className="shadow-lg">
                           {scorePercent}%
                         </Badge>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                           <div className="hidden sm:flex items-center gap-2 mb-2">
                              <Badge variant={confidenceBadge.variant} className="rounded-lg">
                                {confidenceBadge.label}
                              </Badge>
                              <div className="flex items-center gap-1.5">
                                 <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${match.confidenceScore > 0.7 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                      style={{ width: `${scorePercent}%` }}
                                    />
                                 </div>
                                 <span className="text-xs font-bold text-gray-500">{scorePercent}%</span>
                              </div>
                           </div>
                           <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {match.itemId?.description || 'Item description unavailable'}
                           </h3>
                        </div>
                        
                        {match.itemId?.status && (
                           <Badge variant={match.itemId.status === 'AVAILABLE' ? 'success' : 'default'} className="shadow-sm border-none uppercase tracking-widest text-[10px]">
                              {match.itemId.status}
                           </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 font-medium bg-gray-50/50 p-2 rounded-lg">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="truncate">{match.itemId?.locationFound || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-medium bg-gray-50/50 p-2 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>
                            {match.itemId?.dateFound 
                              ? `${formatDate(match.itemId.dateFound)}` 
                              : 'Unknown Date'}
                          </span>
                        </div>
                      </div>

                      {match.reasons && match.reasons.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {match.reasons.map((reason: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold px-2.5 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 uppercase tracking-tight"
                            >
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                         <Link to={`/items/${match.itemId?._id}`} className="flex-1">
                            <Button variant="outline" size="sm" fullWidth className="rounded-xl border-gray-200">
                               Details
                            </Button>
                         </Link>
                         <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            className="flex-1 rounded-xl shadow-lg shadow-blue-50"
                            disabled={match.itemId?.status !== 'AVAILABLE'}
                            onClick={() => match.itemId && navigate(`/claims/create?itemId=${match.itemId._id}`)}
                         >
                            {match.itemId?.status === 'AVAILABLE' ? 'Is This Yours?' : 'Not Available'}
                         </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Checking for matches...</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Our automated match engine is scanning the database. We'll notify you as soon as a potential match is found.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReportMatches;
