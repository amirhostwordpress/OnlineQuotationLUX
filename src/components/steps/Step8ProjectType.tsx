import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';

const Step7ProjectType: React.FC = () => {
  const { data, updateData } = useQuotation();

  const projectTypes = [
    'Kitchen - Ready for worktops now / ASAP',
    'Kitchen - Under renovation',
    'Kitchen - Planning stage',
    'Bathroom - Ready for worktops now / ASAP',
    'Bathroom - Under renovation',
    'Bathroom - Planning stage',
    'Commercial - Office space',
    'Commercial - Restaurant/Hotel',
    'Commercial - Retail',
    'Residential - New construction',
    'Residential - Renovation',
    'Other - Please specify in comments'
  ];

  const handleProjectTypeSelect = (type: string) => {
    updateData({ projectType: type });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 6 (of 7) - Project Type & Application
        </h2>
        <p className="text-lg text-gray-600">
          Help us understand your specific project requirements.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Project Type *
        </label>
        <select
          value={data.projectType}
          onChange={(e) => handleProjectTypeSelect(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select your project type</option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <NavigationButtons
        isNextDisabled={!data.projectType}
      />
    </div>
  );
};

export default Step7ProjectType;