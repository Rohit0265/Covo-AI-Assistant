import React, { useState } from 'react';
import { googleProvider, auth } from '../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import SideBar from '../components/sideBar';
import chatArea from '../components/chatArea';
import artifacts from '../components/artifacts';
import api from '../utils/axios';

const Home = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post('/auth/login', token);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      console.log(token);
      await handleLogin({ token });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? 'Signing up...' : 'Logging in...', { email, password });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
      <SideBar/>
      <chatArea/>
      <artifacts/>
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-md">
        {/* Header Text */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-100">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isSignUp
              ? 'Sign up to get started with your account'
              : 'Please enter your details to sign in'}
          </p>
        </div>

        {/* Continue with Google Option */}
        <button
          type="button"
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-zinc-800 text-zinc-200 font-medium py-2.5 px-4 border border-zinc-700 rounded-lg hover:bg-zinc-700/80 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 bg-zinc-800/70 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 bg-zinc-800/70 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer shadow-md"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center text-sm text-zinc-400">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
