import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QuotationData, QuotationContextType } from '../types';
import { useAdmin } from './AdminContext';
import { sendAdminNotification } from '../services/emailService';
import { submitQuotation, submitQuotationPiece } from '../services/quotationService';
import { calculatePricing } from '../utils/pricingCalculator';

const initialData: QuotationData = {
  serviceLevel: '',
  selectedProducts: [],
  materialSource: '',
  materialType: '',
  materialColor: '',
  worktopLayout: '',
  productPieces: {},
  pieces: {},
  customEdge: '',
  sinkCutOut: '',
  hobCutOut: '',
  underMountedSink: '',
  steelFrame: '',
  cutOuts: '',
  tapHoles: '',
  upstands: '',
  drainGrooves: '',
  timeline: '',
  sinkOption: '',
  sinkStyle: '',
  projectType: '',
  name: '',
  email: '',
  contactNumber: '',
  location: '',
  additionalComments: '',
  designerName: '',
  designerContact: '',
  designerEmail: '',
};

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from sessionStorage if available
  const getInitialData = () => {
    const stored = sessionStorage.getItem('quotationData');
    const data = stored ? JSON.parse(stored) : initialData;
    console.log('QuotationContext - Loading initial data:', data);
    return data;
  };
  const [data, setData] = useState<QuotationData>(getInitialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isQuoteSubmitted, setIsQuoteSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');
  const totalSteps = 7;
  const { settings, refreshQuotes } = useAdmin();

  // Persist data to sessionStorage on change
  useEffect(() => {
    console.log('QuotationContext - Persisting data to sessionStorage:', data);
    sessionStorage.setItem('quotationData', JSON.stringify(data));
  }, [data]);

  const updateData = (updates: Partial<QuotationData>) => {
    console.log('QuotationContext - updateData called with:', updates);
    setData(prev => {
      const newData = { ...prev, ...updates };
      console.log('QuotationContext - new data:', newData);
      return newData;
    });
  };

  const generateQuoteId = () => {
    const random = Math.random().toString(36).substr(2, 5);
    return `LUX-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${random}`.toUpperCase();
  };

  const submitQuote = async () => {
    const newQuoteId = generateQuoteId();
    setQuoteId(newQuoteId);
    setIsQuoteSubmitted(true);

    // Calculate pricing breakdown
    const pricing = await calculatePricing(data);

    // Prepare main quotation data for backend
    const quotationPayload = {
      ...data,
      quote_id: newQuoteId,
      quote_data: JSON.stringify(data), // store full form as JSON string
      total_amount: pricing.grandTotal,
      pricing_data: JSON.stringify(pricing),
      total_area: pricing.totalSqm,
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Submit main quotation
      const result = await submitQuotation(quotationPayload);
      const quotationDbId = result.id;

      // 2. Submit each piece
      const pieces = data.pieces || {};
      for (const [piece_letter, piece] of Object.entries(pieces)) {
        await submitQuotationPiece({
          quotation_id: quotationDbId,
          piece_letter,
          length_mm: piece.length,
          width_mm: piece.width,
          thickness_mm: piece.thickness,
        });
      }

      // 3. Optionally: send admin notification (existing logic)
      try {
        const emailSent = await sendAdminNotification(data, newQuoteId, settings);
        if (emailSent) {
          console.log('Admin notification email sent successfully');
        } else {
          console.warn('Failed to send admin notification email');
        }
      } catch (error) {
        console.error('Error sending admin notification:', error);
      }

      // 4. Refresh admin quotes
      if (refreshQuotes) await refreshQuotes();
    } catch (error) {
      console.error('Error submitting quotation:', error);
    }
  };

  const resetQuotation = () => {
    setData(initialData);
    setCurrentStep(1);
    setIsQuoteSubmitted(false);
    setQuoteId('');
  };

  const value = {
    data,
    updateData,
    currentStep,
    setCurrentStep,
    totalSteps,
    isQuoteSubmitted,
    quoteId,
    submitQuote,
    resetQuotation,
  };

  return (
    <QuotationContext.Provider value={value}>
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error('useQuotation must be used within a QuotationProvider');
  }
  return context;
};