import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput } from "../components/forms/TextInput";
import { CurrencyInput } from "../components/forms/CurrencyInput";

const dummySchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number({ invalid_type_error: "Amount is required" }).positive("Amount must be greater than zero"),
});

type DummyFormData = z.infer<typeof dummySchema>;

function DummyForm({ onSubmit }: { onSubmit: (data: DummyFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DummyFormData>({
    resolver: zodResolver(dummySchema),
    mode: "onTouched",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Name"
        {...register("name")}
        error={errors.name?.message}
      />
      <CurrencyInput
        label="Amount"
        {...register("amount", { valueAsNumber: true })}
        error={errors.amount?.message}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("Forms & Validation Platform", () => {
  it("shows validation errors on empty submission and does not call onSubmit", async () => {
    const handleSubmit = vi.fn();
    render(<DummyForm onSubmit={handleSubmit} />);

    // Submitting empty
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText(/Invalid input.*NaN|Amount is required/i)).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("currency input prevents invalid keystrokes and formats on blur", async () => {
    const user = userEvent.setup();
    render(<CurrencyInput label="Amount" name="amount" />);
    
    // We get the display input which RHF does not register directly but user interacts with
    // It has the label "Amount"
    const input = screen.getByLabelText("Amount") as HTMLInputElement;

    // Type valid number
    await user.type(input, "1234");
    expect(input.value).toBe("1234");

    // Try typing letters
    await user.type(input, "abc");
    expect(input.value).toBe("1234"); // Should drop letters

    // Type decimal
    await user.type(input, ".56");
    expect(input.value).toBe("1234.56");

    // Try second decimal
    await user.type(input, ".");
    expect(input.value).toBe("1234.56"); // Dropped

    // Blur to format
    fireEvent.blur(input);
    expect(input.value).toBe("1,234.56");
  });

  it("screen readers announce validation errors properly", () => {
    render(<TextInput label="Email" name="email" error="Invalid email" />);
    
    const input = screen.getByLabelText("Email");
    const errorText = screen.getByText("Invalid email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    
    const errorId = errorText.getAttribute("id");
    expect(errorId).toBeTruthy();
    expect(input).toHaveAttribute("aria-errormessage", errorId);
    expect(input).toHaveAttribute("aria-describedby", errorId);
    expect(errorText).toHaveAttribute("role", "alert");
  });
});
