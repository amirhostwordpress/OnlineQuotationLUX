import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';

const Step3WorktopLayout: React.FC = () => {
  const { data, updateData } = useQuotation();

  const layoutOptions = [
    {
      id: 'u-island',
      title: 'U + Island',
      subtitle: 'U Shape + Island',
      description: 'Maximum counter space with central island',
      icon: '🏝️'
    },
    {
      id: 'u-shape',
      title: 'U Shape',
      subtitle: 'U Shape',
      description: 'Three-wall kitchen layout',
      icon: '🔲'
    },
    {
      id: 'l-island',
      title: 'L + Island',
      subtitle: 'L Shape + Island',
      description: 'Corner layout with additional island',
      icon: '🏝️'
    },
    {
      id: 'l-shape',
      title: 'L Shape',
      subtitle: 'L Shape',
      description: 'Efficient corner kitchen layout',
      icon: '📐'
    },
    {
      id: 'galley',
      title: 'Galley',
      subtitle: '2 Pieces (Galley)',
      description: 'Two parallel countertops',
      icon: '⚫'
    },
    {
      id: '1-piece',
      title: '1 Piece',
      subtitle: '1 Piece',
      description: 'Single straight countertop',
      icon: '➖'
    },
    {
      id: 'custom',
      title: 'Custom',
      subtitle: 'Other',
      description: 'Custom layout configuration',
      icon: '🎨'
    }
  ];

  const handleLayoutSelect = (layout: string) => {
    updateData({ worktopLayout: layout as any });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 3 (of 7) - Select Worktop Layout
        </h2>
        <p className="text-lg text-gray-600">
          Choose the layout that best matches your space configuration.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="grid gap-3 md:grid-cols-3">

            {layoutOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleLayoutSelect(option.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  data.worktopLayout === option.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NavigationButtons
        isNextDisabled={!data.worktopLayout}
      />
    </div>
  );
};

export default Step3WorktopLayout;