import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';
import { Clock, Zap, Calendar } from 'lucide-react';

const Step6Timeline: React.FC = () => {
  const { data, updateData } = useQuotation();

  const timelineOptions = [
    {
      id: 'asap-2weeks',
      title: 'ASAP to 2 Weeks',
      description: 'Urgent installation required',
      icon: <Zap size={24} className="text-red-500" />
    },
    {
      id: '3-6weeks',
      title: '3 to 6 Weeks',
      description: 'Standard timeline',
      icon: <Clock size={24} className="text-blue-500" />
    },
    {
      id: '6weeks-plus',
      title: '6 Weeks or more',
      description: 'Flexible timeline',
      icon: <Calendar size={24} className="text-green-500" />
    }
  ];

  const handleTimelineSelect = (timeline: string) => {
    updateData({ timeline: timeline as any });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 5 (of 7) - Project Timeline
        </h2>
        <p className="text-lg text-gray-600">
          Tell us how quickly you need your worktops installed.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="grid gap-3 md:grid-cols-3">
          {timelineOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleTimelineSelect(option.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                data.timeline === option.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {option.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {option.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavigationButtons
        isNextDisabled={!data.timeline}
      />
    </div>
  );
};

export default Step6Timeline;