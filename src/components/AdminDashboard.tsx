import React, { useState, useEffect } from 'react';
import { X, Users, MessageSquare, Phone, Mail, Calendar, CheckSquare, Clock, Zap, MapPin, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';
import { Inquiry } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchInquiries();
    }
  }, [isOpen]);

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/inquiries');
      if (!response.ok) {
        throw new Error('Failed to retrieve inquiries.');
      }
      const data = await response.json();
      // Sort newest first
      data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setInquiries(data);
      if (data.length > 0 && !selectedInquiry) {
        setSelectedInquiry(data[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading records.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'contacted' | 'completed') => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status.');
      }
      
      // Update local state
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status } : null);
      }
    } catch (err: any) {
      setError(err.message || 'Error updating status.');
    }
  };

  if (!isOpen) return null;

  return (
    <div id="admin-dashboard-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 rounded-xl text-slate-950">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight">Infinity Lead Manager</h2>
              <p className="text-xs text-slate-400 font-mono">Dealership Dashboard &mdash; Vijay Nagar, Indore</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchInquiries}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Refresh Inquiries"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Lead List */}
          <div className="w-full md:w-2/5 border-r border-slate-800 flex flex-col bg-slate-950/20 overflow-y-auto">
            <div className="p-4 border-b border-slate-800/60 bg-slate-950/40 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Lead Stream ({inquiries.length})</span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono font-semibold">Live Feed</span>
            </div>

            {loading && inquiries.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Users className="w-12 h-12 text-slate-700 mb-2" />
                <p className="text-sm">No customer inquiries recorded yet.</p>
                <p className="text-xs text-slate-650 mt-1">Calculations and contact submissions will display here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {inquiries.map((inq) => {
                  const isSelected = selectedInquiry?.id === inq.id;
                  return (
                    <div
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`p-4 text-left cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-slate-800/45 border-l-4 border-amber-500' 
                          : 'hover:bg-slate-850 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-200">{inq.name}</h4>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                          inq.status === 'new'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : inq.status === 'contacted'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 font-mono mt-1">{inq.phone}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(inq.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {inq.calculation && (
                          <span className="text-amber-400 bg-amber-500/5 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            {inq.calculation.recommendedCapacityKw} kW
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Detailed View */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/40">
            {selectedInquiry ? (
              <div className="space-y-6">
                
                {/* Contact Hero */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedInquiry.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">Lead ID: {selectedInquiry.id}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedInquiry.id, 'new')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedInquiry.status === 'new'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Set New
                    </button>
                    <button
                      onClick={() => updateStatus(selectedInquiry.id, 'contacted')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedInquiry.status === 'contacted'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => updateStatus(selectedInquiry.id, 'completed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedInquiry.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="p-3 bg-slate-950/40 border border-slate-800 hover:border-amber-500/40 rounded-xl flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Phone Line</span>
                      <span className="text-sm font-semibold text-slate-200">{selectedInquiry.phone}</span>
                    </div>
                  </a>

                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="p-3 bg-slate-950/40 border border-slate-800 hover:border-amber-500/40 rounded-xl flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Email Address</span>
                      <span className="text-sm font-semibold text-slate-200">{selectedInquiry.email}</span>
                    </div>
                  </a>
                </div>

                {/* Message Box */}
                {selectedInquiry.message && (
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono uppercase tracking-wider mb-2 pb-1.5 border-b border-slate-800/40">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Message / Requirements</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{selectedInquiry.message}"
                    </p>
                  </div>
                )}

                {/* AI Solar Calculation Details if present */}
                {selectedInquiry.calculation ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Lead AI Configuration Results
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">System Type</span>
                        <span className="text-sm font-bold text-white uppercase font-mono">{selectedInquiry.calculation.systemType}</span>
                      </div>
                      <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Capacity</span>
                        <span className="text-sm font-bold text-white font-mono">{selectedInquiry.calculation.recommendedCapacityKw} kW</span>
                      </div>
                      <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Panels</span>
                        <span className="text-sm font-bold text-white font-mono">{selectedInquiry.calculation.estimatedPanels} Units</span>
                      </div>
                      <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Est. Cost</span>
                        <span className="text-sm font-bold text-amber-400 font-mono">₹{selectedInquiry.calculation.estimatedCostInr.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedInquiry.monthlyBill && (
                        <div className="p-3 bg-slate-950/30 border border-slate-800/40 rounded-xl">
                          <span className="text-[9px] text-slate-500 block uppercase font-mono">Current Monthly Bill</span>
                          <span className="text-sm font-bold text-slate-300 font-mono">₹{selectedInquiry.monthlyBill.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {selectedInquiry.roofAreaSqFt && (
                        <div className="p-3 bg-slate-950/30 border border-slate-800/40 rounded-xl">
                          <span className="text-[9px] text-slate-500 block uppercase font-mono">Rooftop Area</span>
                          <span className="text-sm font-bold text-slate-300 font-mono">{selectedInquiry.roofAreaSqFt} sq ft</span>
                        </div>
                      )}
                      <div className="p-3 bg-slate-950/30 border border-slate-800/40 rounded-xl">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Annual ROI Savings</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">₹{selectedInquiry.calculation.estimatedAnnualSavingsInr.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border border-slate-800 bg-slate-950/20 rounded-xl text-center text-slate-500">
                    <span className="text-xs font-mono">No Solar Calculation parameters were generated for this inquiry.</span>
                  </div>
                )}

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <Users className="w-16 h-16 text-slate-800 mb-2" />
                <h4 className="text-slate-400 font-bold">Select a Lead</h4>
                <p className="text-xs max-w-sm mt-1">Choose an inquiry from the left lead stream panel to inspect customer details and configure status flags.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
