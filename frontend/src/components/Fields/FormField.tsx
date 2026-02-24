'use client';

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string | string[];
  required?: boolean;
  helpText?: string;
}

interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';
}

interface TextareaFieldProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  type: 'textarea';
  rows?: number;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps;

export default function FormField(props: FormFieldProps) {
  const { label, error, required, helpText, type = 'text', ...rest } = props;

  const hasError = error && (Array.isArray(error) ? error.length > 0 : error);
  const errorMessages = Array.isArray(error) ? error : error ? [error] : [];

  const baseInputClasses = `
    w-full min-h-[44px] px-4 py-3
    bg-white/5 border rounded-xl
    text-gray-900 dark:text-white placeholder-white/50
    focus:outline-none focus:ring-2
    transition-all duration-200
    touch-manipulation text-base
    ${hasError
      ? 'border-red-400/50 focus:ring-red-500/50 focus:border-red-400/50'
      : 'border-white/20 focus:ring-blue-500/50 focus:border-blue-400/50'
    }
  `;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-white/90">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Input or Textarea */}
      {type === 'textarea' ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={baseInputClasses}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${props.name || label}-error` : undefined}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          type={type}
          className={baseInputClasses}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${props.name || label}-error` : undefined}
        />
      )}

      {/* Help Text */}
      {helpText && !hasError && (
        <p className="text-xs text-white/50">{helpText}</p>
      )}

      {/* Error Messages */}
      {hasError && (
        <div
          id={`${props.name || label}-error`}
          className="space-y-1"
          role="alert"
          aria-live="polite"
        >
          {errorMessages.map((err, index) => (
            <p key={index} className="text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// Select field variant
interface SelectFieldProps extends BaseFieldProps {
  children: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
}

export function SelectField({ label, error, required, helpText, children, ...rest }: SelectFieldProps) {
  const hasError = error && (Array.isArray(error) ? error.length > 0 : error);
  const errorMessages = Array.isArray(error) ? error : error ? [error] : [];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/90">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <select
        {...rest}
        className={`
          w-full min-h-[44px] px-4 py-3
          bg-white/5 border rounded-xl
          text-white
          focus:outline-none focus:ring-2
          transition-all duration-200
          touch-manipulation text-base
          ${hasError
            ? 'border-red-400/50 focus:ring-red-500/50 focus:border-red-400/50'
            : 'border-white/20 focus:ring-blue-500/50 focus:border-blue-400/50'
          }
        `}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${rest.name || label}-error` : undefined}
      >
        {children}
      </select>

      {helpText && !hasError && (
        <p className="text-xs text-white/50">{helpText}</p>
      )}

      {hasError && (
        <div
          id={`${rest.name || label}-error`}
          className="space-y-1"
          role="alert"
          aria-live="polite"
        >
          {errorMessages.map((err, index) => (
            <p key={index} className="text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
