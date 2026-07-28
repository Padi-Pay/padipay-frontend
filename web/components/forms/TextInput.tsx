import React from "react";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  suffix?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, suffix, id, className = "", ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const baseClasses = "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";
    const stateClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    
    // Adjust padding if there is a suffix (like an icon)
    const paddingClasses = suffix ? "pr-10" : "";

    return (
      <div className="flex w-full flex-col space-y-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`${baseClasses} ${stateClasses} ${paddingClasses} ${className}`}
            aria-invalid={!!error}
            aria-errormessage={error ? errorId : undefined}
            aria-describedby={
              error ? errorId : hint ? hintId : undefined
            }
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
        {error && (
          <span id={errorId} className="text-sm text-red-500" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";
