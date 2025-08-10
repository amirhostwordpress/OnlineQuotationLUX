import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuotation } from '../../context/QuotationContext';

interface NavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onBack,
  isNextDisabled = false,
  nextLabel = 'Next',
  backLabel = 'Back'
}) => {
  const { currentStep, setCurrentStep, totalSteps } = useQuotation();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex justify-between items-center pt-8">
      <button
        onClick={handleBack}
        disabled={currentStep === 1}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          currentStep === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <ChevronLeft size={20} />
        <span>{backLabel}</span>
      </button>

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
          isNextDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
        }`}
      >
        <span>{nextLabel}</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default NavigationButtons;