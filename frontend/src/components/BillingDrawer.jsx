import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBillingOrder, verifyBillingPayment } from '../features/createOrder';
import { setUserData } from '../redux/userSlice';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BillingDrawer = ({ isOpen, onClose }) => {
  const userData = useSelector((state) => state.user?.userData);
  const dispatch = useDispatch();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter Credits',
      tokens: '500',
      price: '₹199',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro Credits',
      tokens: '1,000',
      price: '₹499',
      popular: true,
      save: 'Best Value',
    },
  ];

  const handlePayment = async (planId) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    try {
      setLoadingPlan(planId);
      const data = await createBillingOrder(planId);

      if (!data || !data.order) {
        alert('Failed to create order. Please try again.');
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency || 'INR',
        name: 'Covo AI',
        description: `Buy ${planId.toUpperCase()} Credits`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verification = await verifyBillingPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verification?.user) {
              dispatch(setUserData(verification.user));
            }
            alert('🎉 Payment successful! Your credits have been updated.');
            if (onClose) onClose();
          } catch (error) {
            console.error('Payment verification failed:', error);
            const message = error.response?.data?.message || 'Payment verification failed.';
            alert(`${message} Please contact support if money was deducted.`);
          }
        },
        prefill: {
          name: userData?.name || userData?.displayName || userData?.username || '',
          email: userData?.email || '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description || 'Transaction cancelled'}`);
      });
      razorpayInstance.open();
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to initiate order. Ensure backend billing service is running.');
    } finally {
      setLoadingPlan(null);
    }
  };

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
            title="Close"
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
                <span className="text-4xl font-black text-white tracking-tight">
                  {Number.isFinite(userData?.credits) ? userData.credits : 100}
                </span>
                <span className="text-purple-300 font-medium">tokens</span>
              </div>
            </div>
          </div>

          {/* Token Packages */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Buy More Credits</h3>
            <div className="space-y-3">
              {plans.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => !loadingPlan && handlePayment(pkg.id)}
                  className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    pkg.popular
                      ? 'bg-indigo-900/20 border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-900/30'
                      : 'bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/50'
                  } ${loadingPlan === pkg.id ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${pkg.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-700/50 text-zinc-400'}`}>
                      {loadingPlan === pkg.id ? (
                        <svg className="w-4 h-4 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 6v12M15 9.5a2.5 2.5 0 00-5 0c0 2 3 2.5 3 4.5a2.5 2.5 0 01-5 0" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-bold">{pkg.name} <span className="text-zinc-400 font-normal text-sm">({pkg.tokens} Tokens)</span></div>
                      {pkg.save && <div className="text-xs text-emerald-400 font-medium">{pkg.save}</div>}
                    </div>
                  </div>
                  <div className="font-semibold text-white text-lg">{pkg.price}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/60 bg-zinc-900/30 text-center">
          <p className="text-xs text-zinc-500">Payments are securely processed by Razorpay.</p>
        </div>
      </div>
    </>
  );
};

export default BillingDrawer;
