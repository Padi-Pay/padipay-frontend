import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextInput, TextInputProps } from "./TextInput";

export const PasswordInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleIcon = (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    );

    return (
      <TextInput
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        suffix={toggleIcon}
      />
    );
  }
);
PasswordInput.displayName = "PasswordInput";
