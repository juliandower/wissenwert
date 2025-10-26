"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from "./ui/card";

interface ScoreWaterfallProps {
  questionPoints: number[];
  questionLeverages: (number | null)[];
  finalScore: number;
}

export function ScoreWaterfall({ questionPoints, questionLeverages, finalScore }: ScoreWaterfallProps) {
  const t = useTranslations('results');
  // Calculate cumulative scores for waterfall visualization
  let cumulativeScore = 0;
  const cumulativeScores = questionPoints.map((points) => {
    cumulativeScore += points;
    return cumulativeScore;
  });

  // Find the range for scaling - ensure we have space above and below 0
  const allScores = [0, ...cumulativeScores, finalScore];
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const range = Math.max(Math.abs(minScore), Math.abs(maxScore));
  const totalRange = range + range; // Total height from -range to +range

  const getLeverageIcon = (leverage: number | null) => {
    if (!leverage) return null;
    return leverage === 0.5 ? "½x" : `${leverage}x`;
  };

  const getLeverageColor = (leverage: number | null) => {
    if (!leverage) return "";
    if (leverage === 0.5) return "bg-green-500";
    if (leverage === 2) return "bg-blue-500";
    if (leverage === 3) return "bg-purple-500";
    return "";
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2">{finalScore}</div>
            <h3 className="text-2xl font-bold text-white mb-1">{t('finalScore')}</h3>
            <p className="text-sm text-gray-400">{t('scoreProgress')}</p>
          </div>

          {/* Waterfall Chart */}
          <div className="relative h-96 mt-6">
            {/* Zero baseline */}
            <div 
              className="absolute left-0 right-0 border-t-2 border-gray-600 border-dashed"
              style={{ bottom: `${(range / totalRange) * 100}%` }}
            />
            {/* Zero label - positioned to the left of the chart */}
            <span 
              className="absolute text-xs text-gray-500"
              style={{ 
                bottom: `${(range / totalRange) * 100}%`,
                left: '0',
                transform: 'translateY(-50%)'
              }}
            >
              0
            </span>

            {/* Grid lines */}
            {[...Array(6)].map((_, i) => {
              const lineValue = -range + (range * 2 / 5) * (i + 1);
              const yPos = ((lineValue + range) / totalRange) * 100;
              return (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-b border-gray-800 opacity-20"
                  style={{ bottom: `${yPos}%` }}
                />
              );
            })}

            {/* Waterfall Bars - Positioned to show cumulative from baseline */}
            <div className="flex h-full gap-1 px-4 pb-16 pt-16 relative">
              {cumulativeScores.map((cumulative, idx) => {
                const points = questionPoints[idx];
                const isPositive = points > 0;
                const leverage = questionLeverages[idx];
                const prevCumulative = idx > 0 ? cumulativeScores[idx - 1] : 0;
                
                // Calculate positions and heights
                const zeroY = (range / totalRange) * 100;
                
                // For first bar, start from 0 baseline
                const startY = idx === 0 
                  ? zeroY 
                  : ((prevCumulative + range) / totalRange) * 100;
                const endY = ((cumulative + range) / totalRange) * 100;
                const height = Math.abs(endY - startY);

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center relative"
                    style={{ height: '100%' }}
                  >
                    {/* Leverage indicator - positioned above bar */}
                    {leverage && (
                      <div
                        className={`
                          absolute rounded-md px-2 py-1 text-xs font-bold
                          ${getLeverageColor(leverage) || "bg-gray-500"}
                          text-white shadow-lg z-20
                        `}
                        style={{ 
                          bottom: isPositive 
                            ? `${endY}%` 
                            : `${startY}%`,
                          transform: 'translateY(-100%)',
                        }}
                      >
                        {getLeverageIcon(leverage)}
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      className={`
                        w-full rounded-md transition-all duration-300
                        ${isPositive ? "bg-teal-500" : "bg-red-500"}
                        ${leverage ? (isPositive ? "ring-2 ring-cyan-300" : "ring-2 ring-red-800") : ""}
                        hover:brightness-110
                        absolute
                      `}
                      style={{ 
                        height: `${Math.max(height, 2)}%`,
                        bottom: `${isPositive ? startY : endY}%`,
                      }}
                    />

                    {/* Question label and Points - positioned at top */}
                    <div className="absolute -top-16 text-center">
                      <div className="text-xs text-gray-400 mb-1">Q{idx + 1}</div>
                      <div
                        className={`
                          text-xs font-bold
                          ${isPositive ? "text-green-400" : "text-red-400"}
                        `}
                      >
                        {points > 0 ? "+" : ""}
                        {points.toFixed(0)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-xs pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-500 rounded"></div>
              <span>{t('correctLabel')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>{t('incorrectLabel')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>{t('halfXLeverage')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>{t('twoXLeverage')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>{t('threeXLeverage')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

