import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';
import { Factory, Truck, Wrench } from 'lucide-react';

const Step1ScopeOfWork: React.FC = () => {
  const { data, updateData } = useQuotation();

  const serviceOptions = [
    {
      id: 'fabrication',
      title: 'Fabrication Only',
      description: 'Professional cutting, shaping, and finishing of your materials',
      icon: <Factory size={32} className="text-blue-600" />
    },
    {
      id: 'fabrication-delivery',
      title: 'Fabrication & Delivery',
      description: 'Complete fabrication service plus safe delivery to your location',
      icon: <Truck size={32} className="text-green-600" />
    },
    {
      id: 'fabrication-delivery-installation',
      title: 'Fabrication, Delivery & Installation',
      description: 'Complete end-to-end service including professional installation',
      icon: <Wrench size={32} className="text-purple-600" />
    }
  ];

  const handleServiceSelect = (serviceLevel: 'fabrication' | 'fabrication-delivery' | 'fabrication-delivery-installation' | '') => {
    updateData({ serviceLevel });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Note: Steel part of the job after site measurement */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded">
        <strong>Note:</strong> Steel part of the job after site measurement
      </div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 1 (of 7) - Scope of Work
        </h2>
        <p className="text-lg text-gray-600">
          Select the service level that best fits your project requirements.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Select Your Scope of Work
        </h3>

        {/* 🟦 Service Options in One Row */}
        <div className="grid gap-4 md:grid-cols-3">
          {serviceOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleServiceSelect(option.id as 'fabrication' | 'fabrication-delivery' | 'fabrication-delivery-installation' | '')}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                data.serviceLevel === option.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{option.icon}</div>
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

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Factory size={24} className="mr-2 text-blue-600" />
          About Luxone Services
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">✂️ Fabrication</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Precision cutting & shaping</li>
              <li>• Edge polishing & finishing</li>
              <li>• Quality control inspection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">🚚 Delivery</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Safe packaging & transport</li>
              <li>• UAE-wide delivery coverage</li>
              <li>• Scheduled delivery timing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">🔧 Installation</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Professional installation team</li>
              <li>• Site preparation & cleanup</li>
              <li>• Quality guarantee</li>
            </ul>
          </div>
        </div>
      </div>

      <NavigationButtons isNextDisabled={!data.serviceLevel} />
    </div>
  );
};

export default Step1ScopeOfWork;
