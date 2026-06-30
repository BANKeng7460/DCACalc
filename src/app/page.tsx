"use client";

import { useState, useMemo } from "react";
import { Calculator, ArrowRight, TrendingUp, TrendingDown, DollarSign, Percent, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DCA_Calculator() {
  const [costPerShare, setCostPerShare] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [targetPercentage, setTargetPercentage] = useState<string>("");

  const numCostPerShare = parseFloat(costPerShare);
  const numCurrentPrice = parseFloat(currentPrice);
  const numTotalCost = parseFloat(totalCost);
  const numTargetPercentage = parseFloat(targetPercentage);

  const stats = useMemo(() => {
    if (isNaN(numCostPerShare) || isNaN(numCurrentPrice) || numCostPerShare <= 0 || numCurrentPrice <= 0) {
      return null;
    }

    const currentPercentage = ((numCurrentPrice - numCostPerShare) / numCostPerShare) * 100;
    const isLoss = currentPercentage < 0;
    
    let depositRequired = 0;
    let newCostPerShare = numCostPerShare;
    let impossible = false;
    let message = "";

    if (!isNaN(numTotalCost) && numTotalCost > 0 && !isNaN(numTargetPercentage)) {
      const targetT = numTargetPercentage / 100;
      
      if (isLoss && targetT >= 0) {
        impossible = true;
        message = "Cannot reach a positive profit/break-even by buying at a lower price than your average cost.";
      } else if (!isLoss && targetT < currentPercentage / 100) {
         // If already in profit, buying more at a higher price lowers profit %, but maybe they just want to average up.
         newCostPerShare = numCurrentPrice / (1 + targetT);
         const shares = numTotalCost / numCostPerShare;
         const sharesNeeded = (shares * (newCostPerShare - numCostPerShare)) / (numCurrentPrice - newCostPerShare);
         depositRequired = sharesNeeded * numCurrentPrice;
         
         if (sharesNeeded < 0) {
             impossible = true;
             message = "Target percentage cannot be reached by buying more.";
         }
      } else {
        newCostPerShare = numCurrentPrice / (1 + targetT);
        const shares = numTotalCost / numCostPerShare;
        
        // sharesNeeded = S * (P_new - P_avg) / (P_cur - P_new)
        const denominator = numCurrentPrice - newCostPerShare;
        
        if (denominator === 0) {
          impossible = true;
          message = "Current price equals target new average price. Infinite deposit needed.";
        } else {
          const sharesNeeded = (shares * (newCostPerShare - numCostPerShare)) / denominator;
          depositRequired = sharesNeeded * numCurrentPrice;
          
          if (depositRequired < 0) {
            impossible = true;
            if (targetT < currentPercentage / 100) {
              message = "Target percentage is lower than your current loss. You cannot increase your loss percentage by buying at the current price.";
            } else {
              message = "Target percentage cannot be reached by buying more.";
            }
          }
        }
      }
    }

    return {
      currentPercentage,
      isLoss,
      depositRequired: impossible ? null : depositRequired,
      newCostPerShare: impossible ? null : newCostPerShare,
      impossible,
      message,
      hasDcaInputs: !isNaN(numTotalCost) && numTotalCost > 0 && !isNaN(numTargetPercentage)
    };
  }, [numCostPerShare, numCurrentPrice, numTotalCost, numTargetPercentage]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 flex justify-center items-center p-4 sm:p-8">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 z-10">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">DCA Calculator</h1>
              <p className="text-slate-400 text-sm mt-1">Optimize your average entry price</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Cost Per Share" 
                icon={<DollarSign className="w-4 h-4" />} 
                value={costPerShare} 
                onChange={setCostPerShare} 
                placeholder="e.g. 150"
              />
              <InputField 
                label="Current Price" 
                icon={<DollarSign className="w-4 h-4" />} 
                value={currentPrice} 
                onChange={setCurrentPrice} 
                placeholder="e.g. 100"
              />
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-widest flex items-center gap-2">
                Deposit Goal <span className="text-xs text-indigo-400 normal-case tracking-normal font-normal bg-indigo-500/10 px-2 py-0.5 rounded-full">Optional</span>
              </h3>
              
              <InputField 
                label="Total Cost Invested" 
                icon={<DollarSign className="w-4 h-4" />} 
                value={totalCost} 
                onChange={setTotalCost} 
                placeholder="Total amount currently invested"
              />
              
              <InputField 
                label="Target Percentage" 
                icon={<Percent className="w-4 h-4" />} 
                value={targetPercentage} 
                onChange={setTargetPercentage} 
                placeholder="e.g. -10 for a 10% loss"
              />
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Current Status Card */}
          <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h2 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-6">Current Position</h2>
            
            {stats ? (
              <div className="flex items-end gap-4">
                <div>
                  <div className={`text-5xl font-black tracking-tighter ${stats.isLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {stats.currentPercentage > 0 ? '+' : ''}{stats.currentPercentage.toFixed(2)}%
                  </div>
                  <div className="text-slate-500 text-sm mt-2 flex items-center gap-2">
                    {stats.isLoss ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    {stats.isLoss ? 'Currently at a loss' : 'Currently in profit'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic flex items-center gap-2 h-20">
                Enter cost per share and current price to see your standing.
              </div>
            )}
          </div>

          {/* Actionable Insights */}
          <AnimatePresence mode="wait">
            {stats?.hasDcaInputs && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex-1 border backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col justify-center relative overflow-hidden ${
                  stats.impossible 
                    ? 'bg-rose-500/5 border-rose-500/20' 
                    : 'bg-indigo-500/5 border-indigo-500/20'
                }`}
              >
                {stats.impossible ? (
                  <div className="flex flex-col items-center text-center text-rose-400 gap-4">
                    <AlertCircle className="w-12 h-12 opacity-80" />
                    <div>
                      <h3 className="font-semibold text-lg">Goal Unreachable</h3>
                      <p className="text-sm opacity-80 mt-1 max-w-sm">{stats.message}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-indigo-300 text-sm font-medium uppercase tracking-widest mb-8">Action Required</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="text-slate-400 text-sm mb-1">Required Deposit Amount</div>
                        <div className="text-4xl font-bold text-white flex items-center gap-1">
                          <span className="text-indigo-400">$</span>
                          {(stats.depositRequired || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Old Avg</div>
                          <div className="text-xl text-slate-300 font-medium">${numCostPerShare.toFixed(2)}</div>
                        </div>
                        
                        <ArrowRight className="w-5 h-5 text-indigo-500/50" />
                        
                        <div className="flex-1">
                          <div className="text-indigo-400 text-xs uppercase tracking-wider mb-1">New Avg</div>
                          <div className="text-2xl text-white font-bold">${(stats.newCostPerShare || 0).toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-indigo-500/10">
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Total Capital After Deposit</span>
                            <span className="text-white font-medium">
                              ${(numTotalCost + (stats.depositRequired || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({ label, icon, value, onChange, placeholder }: { label: string, icon: React.ReactNode, value: string, onChange: (val: string) => void, placeholder: string }) {
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-medium text-slate-400 group-focus-within:text-indigo-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
        />
      </div>
    </div>
  );
}
