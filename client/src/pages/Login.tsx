import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { BikeIcon, Loader2Icon, LockIcon, MailIcon, UserIcon } from 'lucide-react';

const hero_bg = new URL('../assets/grocery-assets/hero_bg.png', import.meta.url).href;

const Login = () => {
  const [isLoginstate, setIsLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true);
    setTimeout(() => window.location.href = "/", 1000);
  }


  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center">
        <img src={hero_bg} alt="" className="absolute inset-0 object-cover h-full bg-center opacity-10" />
        <div className='relative text-center px-12'>
          <h2 className='text-4xl font-semibold text-white mb-4'>Welcome back to QuickKart</h2>
          <p className='text-white/60 font-serif text-xl max-w-sm mx-auto'>Fresh groceries and organic produce, delivered to your doorstep</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
        <div className="w-full max-w-md">
          {/* Form header message */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <BikeIcon className="size-8 text-app-green" />
              <span className="text-2xl font-semibold text-app-green">QuickKart</span>
            </Link>
            <h1 className="text-2xl font-semibold text-app-green mb-2">
              {isLoginstate ? "Sign in to your account" : "Sign up for a new account"}
            </h1>

            <p className="text-sm text-app-text-light">
              {isLoginstate ? "Don't have an account" : "Already have an account"}
              <button onClick={() => setIsLoginState(!isLoginstate)}
                className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors">
                {isLoginstate ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Login / Register form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Show name field only on Sign Up */}
            {!isLoginstate && (
              <label className="text-sm flex flex-col gap-1">
                Name
                <div className="relative">
                  <UserIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light'/>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full py-3 pl-11 pr-4 text-sm bg-white rounded-xl border border-app-border focus:border-app-green transition-all"
                  />
                </div>
              </label>
            )}

            <label className="text-sm flex flex-col gap-1">
              Email Address
              <div className="relative">
                <MailIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light'/>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@quickkart.com"
                  required
                  className="w-full py-3 pl-11 pr-4 text-sm bg-white rounded-xl border border-app-border 
                  focus:border-app-green transition-all"
                />
              </div>
            </label>

            <label className="text-sm flex flex-col gap-1">
              Password
              <div className="relative">
                <LockIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light'/>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full py-3 pl-11 pr-4 text-sm bg-white rounded-xl border border-app-border 
                  focus:border-app-green transition-all"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-900 flex-center text-white font-semibold-center 
              rounded-xl hover:bg-green-850 transition-colors disabled:opacity-50">
              
            
              {loading ? <Loader2Icon className="animate-spin" /> : (isLoginstate ? "Sign In" : "Sign Up")}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login
