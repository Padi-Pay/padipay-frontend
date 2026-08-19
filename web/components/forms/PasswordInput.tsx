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
        className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
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
