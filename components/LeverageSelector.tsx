"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { LeveragePowerUp } from "@/lib/types";

interface LeverageSelectorProps {
  availableLeverages: LeveragePowerUp[];
  currentLeverage: number | null;
  onSelectLeverage: (multiplier: number) => void;
}

export function LeverageSelector({
  availableLeverages,
  currentLeverage,
  onSelectLeverage,
}: LeverageSelectorProps) {
  const t = useTranslations('quiz');
  const remainingCount = availableLeverages.filter(l => !l.used).length;
  
  const leverageOptions = [
    { multiplier: 0.5, label: t('halfX'), description: t('halfXPoints'), pointsDesc: t('saferPlay') },
    { multiplier: 2, label: t('twoX'), description: t('twoXPoints'), pointsDesc: t('risky') },
    { multiplier: 3, label: t('threeX'), description: t('threeXPoints'), pointsDesc: t('highRisk') },
  ];
  
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-purple-900">{t('leveragePowerUps')}</h3>
            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {remainingCount} {t('remaining')}
            </div>
          </div>
          <p className="text-sm text-purple-700">
            {t('chooseMultiplier')}
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            {leverageOptions.map((option) => {
              const leverage = availableLeverages.find(l => l.multiplier === option.multiplier);
              const isUsed = leverage?.used || false;
              const isSelected = currentLeverage === option.multiplier;
              const canSelect = !isUsed && currentLeverage === null;
              const isDisabled = !canSelect && !isSelected;

              return (
                <Button
                  key={option.multiplier}
                  variant={isSelected ? "default" : "outline"}
                  className={`
                    h-auto py-4 flex flex-col items-center space-y-2
                    ${isSelected ? "bg-purple-600 text-white border-purple-700" : ""}
                    ${isUsed ? "bg-gray-200 border-gray-300" : ""}
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  onClick={() => !isDisabled && onSelectLeverage(option.multiplier)}
                  disabled={isDisabled}
                >
                  <div className="text-2xl font-bold">{option.label}</div>
                  <div className="text-xs">{option.description}</div>
                  <div className="text-xs opacity-75">{option.pointsDesc}</div>
                  {isUsed && (
                    <div className="text-xs font-semibold text-gray-600">Used</div>
                  )}
                </Button>
              );
            })}
          </div>
          
          {currentLeverage === null && remainingCount > 0 && (
            <div className="mt-3 p-3 bg-gray-100 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-600">
                💡 {t('leverageHint')}
              </p>
            </div>
          )}
          
          {remainingCount === 0 && (
            <div className="mt-3 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
              <p className="text-sm text-yellow-900 font-semibold">
                ⚠️ {t('allUsed')}
              </p>
            </div>
          )}
          
          {currentLeverage !== null && (
            <div className="mt-3 p-3 bg-purple-100 rounded-lg border border-purple-300">
              <p className="text-sm font-semibold text-purple-900">
                ✓ {t('applied', { value: currentLeverage })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

