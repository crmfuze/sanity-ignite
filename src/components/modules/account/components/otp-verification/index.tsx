'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { distributorSignup } from '@/lib/medusa/data/distributor';
import ErrorMessage from '@/components/modules/checkout/components/error-message';
import { SubmitButton } from '@/components/modules/checkout/components/submit-button';
import Input from '@/components/modules/common/components/input';

interface OTPVerificationProps {
  email: string;
  requestId: string;
  formData: {
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
  };
  language: string;
  onBack: () => void;
}

const OTPVerification = ({ email, requestId, formData, language, onBack }: OTPVerificationProps) => {
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = async (_currentState: unknown, submitFormData: FormData) => {
    setFormSubmitted(true);
    return await distributorSignup(null, submitFormData);
  };

  const [message, formAction] = useActionState(handleFormSubmit, null);

  useEffect(() => {
    if (message === null && formSubmitted) {
      router.push('/account');
    }
  }, [message, formSubmitted, router]);

  return (
    <div className="max-w-sm flex flex-col items-center" data-testid="otp-verification-page">
      <h1 className="text-large-semi uppercase mb-6">Verify Your Email</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        We&apos;ve sent a verification code to {email}. Please enter it below to complete your registration.
      </p>
      
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Verification Code"
            name="otp_code"
            required
            maxLength={4}
            data-testid="otp-input"
            autoComplete="one-time-code"
          />
          
          {/* Hidden inputs for form data */}
          <input type="hidden" name="request_id" value={requestId} />
          <input type="hidden" name="first_name" value={formData.firstName} />
          <input type="hidden" name="last_name" value={formData.lastName} />
          <input type="hidden" name="password" value={formData.password} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="phone" value={formData.phone} />
          <input type="hidden" name="language" value={language} />
        </div>
        
        <ErrorMessage error={message} data-testid="otp-verification-error" />
        
        <div className="flex flex-col gap-2 mt-6">
          <SubmitButton className="w-full" data-testid="verify-otp-button">
            Complete Registration
          </SubmitButton>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
            data-testid="back-button"
          >
            Back to Registration Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;