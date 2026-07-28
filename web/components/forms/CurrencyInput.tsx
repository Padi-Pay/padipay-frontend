import React, { useState, useRef } from "react";
import { TextInput, TextInputProps } from "./TextInput";

export const CurrencyInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ onChange, onBlur, name, defaultValue, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);

    // Merge refs so react-hook-form can access the hidden input
    const setRefs = (element: HTMLInputElement | null) => {
      hiddenInputRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const formatValue = (val: string) => {
      if (!val) return "";
      const numericString = val.replace(/[^0-9.]/g, "");
      const parts = numericString.split(".");
      
      let integerPart = parts[0];
      // Insert commas for thousands
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      if (parts.length > 1) {
        const decimalPart = parts[1].slice(0, 7); // Max 7 decimals for USDC
        return `${integerPart}.${decimalPart}`;
      }
      return integerPart;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
        "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Enter", "."
      ];
      // Prevent alphabetical characters and non-related symbols
      if (
        !/^[0-9]$/.test(e.key) &&
        !allowedKeys.includes(e.key) &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        e.preventDefault();
      }

      // Prevent multiple decimals
      if (e.key === "." && displayValue.includes(".")) {
        e.preventDefault();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/,/g, "");
      
      // Ensure it remains numeric (only one decimal allowed, already guarded by keydown mostly)
      if (/[^0-9.]/.test(rawValue)) return;

      setDisplayValue(e.target.value);
      
      // Update hidden input so it can be picked up
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = rawValue;
      }

      if (onChange) {
        // RHF needs to see the unformatted value in the event target
        const event = {
          ...e,
          target: hiddenInputRef.current,
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const formatted = formatValue(displayValue);
      setDisplayValue(formatted);
      
      if (onBlur) {
        const event = {
          ...e,
          target: hiddenInputRef.current,
        } as unknown as React.FocusEvent<HTMLInputElement>;
        onBlur(event);
      }
    };

    return (
      <>
        <TextInput
          {...props}
          name={`${name || "currency"}_display`}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        <input
          type="hidden"
          name={name}
          ref={setRefs}
          defaultValue={defaultValue}
        />
      </>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";
