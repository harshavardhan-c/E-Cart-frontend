"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../src/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft, User } from 'lucide-react';

export default function OtpVerificationPage() {
  const router = useRouter();
  const { verifyOtpAndLogin, loading, error, clearAuthError, isAuthenticated } = useAuthContext();
  
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const email = typeof window !== 'undefined' ? localStorage.getItem('otpEmail') : null;

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
      return;
    }
    
    if (!email) {
      router.push('/login');
      return;
    }
    
    clearAuthError();
  }, [isAuthenticated, email, router, clearAuthError]);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      return;
    }

    const result = await verifyOtpAndLogin(email!, otp, name || undefined);
    if (result.success) {
      // Check for pending cart item
      const pendingCartItem = localStorage.getItem('pendingCartItem');
      if (pendingCartItem) {
        try {
          const item = JSON.parse(pendingCartItem);
          // Add to cart in localStorage
          const currentCart = localStorage.getItem('cart');
          const cart = currentCart ? JSON.parse(currentCart) : [];
          const existingItem = cart.find((i: any) => i.id === item.id);
          
          if (existingItem) {
            const updatedCart = cart.map((i: any) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
            localStorage.setItem('cart', JSON.stringify(updatedCart));
          } else {
            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));
          }
          
          // Clear pending item
          localStorage.removeItem('pendingCartItem');
        } catch (error) {
          console.error('Error adding pending cart item:', error);
          localStorage.removeItem('pendingCartItem');
        }
      }
      
      localStorage.removeItem('otpEmail');
      router.push('/');
    } else if (result.error?.includes('not found')) {
      // User doesn't exist, show name input
      setIsNewUser(true);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    // Reset countdown and resend OTP
    setCountdown(120);
    setCanResend(false);
    // You can implement resend logic here
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Verification Code</CardTitle>
            <CardDescription>
              {isNewUser 
                ? "Welcome! Please enter your name to complete registration"
                : "Enter the OTP sent to your email"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isNewUser && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={handleOtpChange}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={otp.length !== 6 || loading}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in {formatTime(countdown)}
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleResendOtp}
                    className="text-sm text-orange-600 hover:text-orange-500"
                  >
                    Resend OTP
                  </Button>
                )}
              </div>

              <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/login')}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Change Email Address
                  </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>
            Didn't receive the code? Check your email or{' '}
            <button
              onClick={handleResendOtp}
              disabled={!canResend}
              className="text-orange-600 hover:text-orange-500 disabled:text-gray-400"
            >
              resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}



