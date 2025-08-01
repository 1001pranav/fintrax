import { LoginBackgroundEffect } from '@/components/BackgroundEffect';
import FormWrapper from '@/components/FormWrapper';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <LoginBackgroundEffect />
      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <FormWrapper>
          {children}
        </FormWrapper>
      </div>
    </div>
  );
}
