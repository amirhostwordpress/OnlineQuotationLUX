import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';

const Step5DesignOptions: React.FC = () => {
  const { data, updateData } = useQuotation();

  // Add-on options
  const handleAddonChange = (field: string, value: boolean) => {
    updateData({ [field]: value } as any);
  };
  const handleSmallHolesChange = (value: number) => {
    updateData({ smallHoles: value });
  };
  // Sink category/type
  const handleSinkCategorySelect = (category: 'client' | 'luxone') => {
    updateData({ sinkCategory: category, sinkType: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 4 (of 7) - Design Options
        </h2>
        <p className="text-lg text-gray-600">
          Choose your sink option for the project.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Optional Add-On Services
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={!!data.buttJointPolish} onChange={e => handleAddonChange('buttJointPolish', e.target.checked)} />
            <span>Butt Joint & Polish</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={!!data.customEdgeAddon} onChange={e => handleAddonChange('customEdgeAddon', e.target.checked)} />
            <span>Custom Edge</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={!!data.hobCutOutAddon} onChange={e => handleAddonChange('hobCutOutAddon', e.target.checked)} />
            <span>Hob Cut Out</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={!!data.drainGroovesAddon} onChange={e => handleAddonChange('drainGroovesAddon', e.target.checked)} />
            <span>Drain Grooves </span>
          </label>
          <div className="flex items-center space-x-3">
            <span>Small Holes</span>
            <input type="number" min={0} value={data.smallHoles || 0} onChange={e => handleSmallHolesChange(Number(e.target.value))} className="w-20 p-2 border rounded" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Sink Options
        </h3>
        <div className="flex space-x-6 mb-4">
          <label className="flex items-center space-x-2">
            <input type="radio" name="sinkCategory" checked={data.sinkCategory === 'client'} onChange={() => handleSinkCategorySelect('client')} />
            <span>Sink Provided by Client</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="sinkCategory" checked={data.sinkCategory === 'luxone'} onChange={() => handleSinkCategorySelect('luxone')} />
            <span>Sink Provided by Luxone</span>
          </label>
        </div>
        {data.sinkCategory === 'client' && (
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input type="radio" name="sinkType" checked={data.sinkType === 'under-mounted'} onChange={() => updateData({ sinkType: 'under-mounted' })} />
              <span>Under Mounted Sink</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="sinkType" checked={data.sinkType === 'top-mounted'} onChange={() => updateData({ sinkType: 'top-mounted' })} />
              <span>Top Mounted Sink</span>
            </label>
          </div>
        )}
      </div>

      <NavigationButtons isNextDisabled={
        !data.sinkCategory || (data.sinkCategory === 'client' && !data.sinkType)
      } />
    </div>
  );
};

export default Step5DesignOptions;