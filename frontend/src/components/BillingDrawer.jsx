import React from 'react';

const BillingDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-[#111218] border-l border-zinc-800/60 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6v12M15 9.5a2.5 2.5 0 00-5 0c0 2 3 2.5 3 4.5a2.5 2.5 0 01-5 0" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Billing & Tokens</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Current Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-zinc-900 border border-purple-500/20 p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-purple-200/70 mb-1">Available Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tight">4,250</span>
                <span className="text-purple-300 font-medium">tokens</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Free plan user</span>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-purple-900/50 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>

          {/* Token Packages */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Buy More Tokens</h3>
            <div className="space-y-3">
              {[
                { tokens: '1,000', price: '$4.99', popular: false },
                { tokens: '5,000', price: '$19.99', popular: true, save: '20%' },
                { tokens: '20,000', price: '$49.99', popular: false, save: '40%' },
              ].map((pkg, idx) => (
                <div key={idx} className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${pkg.popular ? 'bg-indigo-900/20 border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-900/30' : 'bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/50'}`}>
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${pkg.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-700/50 text-zinc-400'}`}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 6v12M15 9.5a2.5 2.5 0 00-5 0c0 2 3 2.5 3 4.5a2.5 2.5 0 01-5 0" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-bold">{pkg.tokens} <span className="text-zinc-400 font-normal text-sm">Tokens</span></div>
                      {pkg.save && <div className="text-xs text-emerald-400 font-medium">Save {pkg.save}</div>}
                    </div>
                  </div>
                  <div className="font-semibold text-white">{pkg.price}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Recent Usage</h3>
            <div className="space-y-4">
              {[
                { task: 'GPT-4 Code Generation', date: 'Today, 2:45 PM', cost: '-15', type: 'usage' },
                { task: 'Image Synthesis', date: 'Today, 1:12 PM', cost: '-45', type: 'usage' },
                { task: 'Token Purchase', date: 'Yesterday', cost: '+5,000', type: 'purchase' },
              ].map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'purchase' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {tx.type === 'purchase' ? (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{tx.task}</div>
                      <div className="text-xs text-zinc-500">{tx.date}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${tx.type === 'purchase' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                    {tx.cost}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/60 bg-zinc-900/30 text-center">
          <p className="text-xs text-zinc-500">Payments are securely processed by Stripe.</p>
        </div>
      </div>
    </>
  );
};

export default BillingDrawer;
