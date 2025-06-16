'use client';

import { useState } from 'react';

import { requestOTP } from '@/lib/medusa/data/distributor';
import Input from '@/components/modules/common/components/input';
import NativeSelect from '@/components/modules/common/components/native-select';
import LocalizedClientLink from '@/components/modules/common/components/localized-client-link';
import OTPVerification from '@/components/modules/account/components/otp-verification';

const DistributorRegister = () => {
  const [otpRequested, setOtpRequested] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleRequestOtp = async () => {
    if (
      !email ||
      !language ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      !formData.phone
    ) {
      setOtpError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setOtpError('Passwords do not match');
      return;
    }

    setIsRequestingOtp(true);
    setOtpError('');

    try {
      const result = await requestOTP(email, language);
      if (result.success) {
        setRequestId(result.payload?.requestId || result.requestId);
        setOtpRequested(true);
      } else {
        const errorMessage =
          result.error?.description ||
          result.error?.data?.message ||
          result.error ||
          'Failed to send OTP';
        setOtpError(errorMessage);
      }
    } catch {
      setOtpError('Failed to send OTP');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleBackToForm = () => {
    setOtpRequested(false);
    setRequestId('');
    setOtpError('');
  };

  // If OTP is requested, show the OTP verification component
  if (otpRequested) {
    return (
      <OTPVerification
        email={email}
        requestId={requestId}
        formData={formData}
        language={language}
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <div className="max-w-sm flex flex-col items-center" data-testid="distributor-register-page">
      <h1 className="text-large-semi uppercase mb-6">Become an Ambrosia Global Distributor</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Join our distributor network and start building your business with Ambrosia Global.
      </p>
      <div className="w-full flex flex-col">
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            minLength={9}
            autoComplete="new-password"
            data-testid="password-input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Input
            label="Confirm Password"
            name="confirm_password"
            required
            minLength={9}
            type="password"
            autoComplete="new-password"
            data-testid="confirm-password-input"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            data-testid="phone-input"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <NativeSelect
              name="language"
              placeholder="Select language"
              data-testid="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="en-US">English</option>
              <option value="es">Spanish</option>
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-2">
            {otpError && <span className="text-red-500 text-sm">{otpError}</span>}
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={isRequestingOtp}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              data-testid="request-otp-button"
            >
              {isRequestingOtp ? 'Sending OTP...' : 'Send Verification Code'}
            </button>
          </div>
        </div>

        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          By creating a distributor account, you agree to Ambrosia Global LLC&apos;s{' '}
          <LocalizedClientLink href="/content/privacy-policy" className="underline">
            Privacy Policy
          </LocalizedClientLink>{' '}
          and{' '}
          <LocalizedClientLink href="/content/terms-of-use" className="underline">
            Terms of Use
          </LocalizedClientLink>
          .
        </span>
      </div>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Want to become a regular member?{' '}
        <LocalizedClientLink href="/account" className="underline">
          Customer Registration
        </LocalizedClientLink>
        .
      </span>
    </div>
  );
};

export default DistributorRegister;
