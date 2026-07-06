import React, { useState } from 'react';
import { X, Sun, Calculator, Zap, Landmark, Leaf, TrendingUp, AlertCircle, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { SolarCalculation, SystemType } from '../types';

interface SolarCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (calc: SolarCalculation, bill: number, area: number) => void;
}

export default function SolarCalculator({ isOpen, onClose, onSubmitInquiry }: SolarCalculatorProps) {
  const [monthlyBill, setMonthlyBill] = useState<string>('3000');
  const [roofArea, setRoofArea] = useState<string>('500');
  const [systemType, setSystemType] = useState<SystemType>('on-grid');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SolarCalculation | null>(null);
  const [subsidy, setSubsidy] = useState<number>(0);
  const [netCost, setNetCost] = useState<number>(0);
  const [report, setReport] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [inquirySent, setInquirySent] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactMsg, setContactMsg] = useState<string>('');
  const [submittingInquiry, setSubmittingInquiry] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setInquirySent(false);

    try {
      const response = await fetch('/api/gemini/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyBill: Number(monthlyBill),
          roofAreaSqFt: Number(roofArea),
          systemType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate solar calculation. Please try again.');
      }

      const data = await response.json();
      setResult(data.calculation);
      setSubsidy(data.calculation.subsidyInr || 0);
      setNetCost(data.calculation.netCostInr || data.calculation.estimatedCostInr);
      setReport(data.report);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone) {
      setError('Please fill in all contact details.');
      return;
    }

    setSubmittingInquiry(true);
    setError('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          address: 'Indore, MP',
          message: contactMsg || `Generated from online AI Calculator: Recommended ${result?.recommendedCapacityKw} kW system.`,
          monthlyBill: Number(monthlyBill),
          roofAreaSqFt: Number(roofArea),
          calculation: result,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry. Please try again.');
      }

      setInquirySent(true);
      // Reset form fields
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMsg('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div id="calculator-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">AI Solar Savings Calculator</h2>
              <p className="text-xs text-slate-400 font-mono">Personalized for Vijay Nagar, Indore</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Input Form Column */}
            <div className="md:col-span-5 space-y-5 bg-slate-950/40 p-5 rounded-xl border border-slate-800/40">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono text-amber-400">Step 1: Enter Usage Details</h3>
              
              <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Avg Monthly Electricity Bill
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-mono text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      required
                      min="500"
                      max="100000"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(e.target.value)}
                      className="block w-full pl-8 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      placeholder="e.g. 3000"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">Based on Indore West Discom tariffs (~₹7.5/unit)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Available Rooftop Area
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input
                      type="number"
                      required
                      min="50"
                      max="10000"
                      value={roofArea}
                      onChange={(e) => setRoofArea(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      placeholder="e.g. 500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-mono text-xs">sq ft</span>
                    </div>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">Shadow-free roof space is recommended</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    System Configuration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'on-grid', label: 'On-Grid', desc: 'Saves Bills' },
                      { key: 'off-grid', label: 'Off-Grid', desc: 'Battery Only' },
                      { key: 'hybrid', label: 'Hybrid', desc: 'Smart Safety' },
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setSystemType(t.key as SystemType)}
                        className={`p-2.5 text-center rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          systemType === t.key
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="block">{t.label}</span>
                        <span className="block text-[8px] font-mono opacity-80 mt-0.5">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Sun className="w-4 h-4 animate-spin-slow" />
                      <span>Designing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Estimate Potential</span>
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-400 flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Results Column */}
            <div className="md:col-span-7 flex flex-col justify-between">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <Sun className="w-16 h-16 text-amber-500 animate-spin-slow mb-4" />
                  <h4 className="text-white font-bold text-lg">Analyzing Solar Irradiance</h4>
                  <p className="text-slate-400 text-sm max-w-sm mt-1">
                    Gemini is calculating exact solar harvest cycles, optimal panels, and PM Surya Ghar central subsidies for Indore...
                  </p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Metric Row */}
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono text-amber-400 mb-3">
                      Step 2: Recommendations & Estimates
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono uppercase">System Capacity</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-extrabold text-white">{result.recommendedCapacityKw}</span>
                          <span className="text-xs text-amber-400 font-semibold font-mono">kW</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono uppercase">Estimated Panels</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-extrabold text-white">{result.estimatedPanels}</span>
                          <span className="text-xs text-slate-400 font-mono">Units</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 block font-mono uppercase">Annual Savings</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-extrabold text-emerald-400">₹{result.estimatedAnnualSavingsInr.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono uppercase">Payback Period</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-extrabold text-white">{result.paybackYears}</span>
                          <span className="text-xs text-slate-400 font-mono">Years</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono uppercase">Central Subsidy</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-extrabold text-amber-400">₹{subsidy.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 block font-mono uppercase">Net Investment</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-extrabold text-white">₹{netCost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generated AI Report */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 max-h-[220px] overflow-y-auto">
                    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-slate-800/60">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">Gemini Suitability Analysis</span>
                    </div>
                    <div className="prose prose-invert prose-xs text-xs text-slate-300 leading-relaxed font-sans space-y-2 whitespace-pre-wrap">
                      {report}
                    </div>
                  </div>

                  {/* Submission CTA Form */}
                  <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-4">
                    {inquirySent ? (
                      <div className="text-center py-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <h4 className="text-white font-bold text-sm">Inquiry Submitted Successfully!</h4>
                        <p className="text-slate-400 text-xs mt-0.5">Infinity Solar's expert from Vijay Nagar will contact you within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleInquirySubmit} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                            Claim Subsidy & Schedule Free Survey
                          </h4>
                          <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold">Subsidy Eligible</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Your Name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Your Email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                          />
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Detailed Address or comments (optional)"
                            value={contactMsg}
                            onChange={(e) => setContactMsg(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-1 focus:ring-amber-500"
                          />
                          <button
                            type="submit"
                            disabled={submittingInquiry}
                            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>{submittingInquiry ? 'Sending...' : 'Confirm'}</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                  <Calculator className="w-12 h-12 text-slate-600 mb-3" />
                  <h4 className="text-slate-300 font-bold text-sm">No Calculations Yet</h4>
                  <p className="text-slate-500 text-xs max-w-xs mt-1">
                    Enter your electric bill and rooftop specifications in the left form and click "Estimate Potential" to see custom recommendations!
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
