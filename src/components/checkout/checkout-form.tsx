"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

/** Customer details collected at checkout (Task 6.1), minus the cart items. */
export interface CheckoutFormValues {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

const EMPTY: CheckoutFormValues = {
  customerName: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
};

type FieldErrors = Partial<Record<keyof CheckoutFormValues, string>>;

/** Required-field validation (Task 6.1): Name, Phone and Address must be set. */
function validate(values: CheckoutFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.customerName.trim()) errors.customerName = "Full name is required.";
  if (!values.phone.trim()) {
    errors.phone = "Phone is required.";
  } else if (!/[0-9]{6,}/.test(values.phone.replace(/[\s()+-]/g, ""))) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!values.address.trim()) errors.address = "Address is required.";
  return errors;
}

/**
 * Checkout details form (Task 6.1). Validates required fields on submit and
 * blocks invalid submissions, only invoking `onSubmit` with clean values.
 */
export function CheckoutForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (values: CheckoutFormValues) => void;
  submitting: boolean;
}) {
  const [values, setValues] = useState<CheckoutFormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});

  function setField(field: keyof CheckoutFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field
        id="customerName"
        label="Full name"
        required
        value={values.customerName}
        error={errors.customerName}
        onChange={(v) => setField("customerName", v)}
        autoComplete="name"
      />
      <Field
        id="phone"
        label="Phone"
        type="tel"
        required
        value={values.phone}
        error={errors.phone}
        onChange={(v) => setField("phone", v)}
        autoComplete="tel"
      />
      <Field
        id="address"
        label="Address"
        required
        value={values.address}
        error={errors.address}
        onChange={(v) => setField("address", v)}
        autoComplete="street-address"
      />
      <Field
        id="city"
        label="City"
        value={values.city}
        error={errors.city}
        onChange={(v) => setField("city", v)}
        autoComplete="address-level2"
      />

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={values.notes}
          onChange={(e) => setField("notes", e.target.value)}
          rows={3}
          placeholder="Delivery instructions, landmarks, etc."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Placing order…" : "Place order — Cash on delivery"}
      </Button>
    </form>
  );
}

/** A labelled text input with inline validation messaging. */
function Field({
  id,
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-[3px]",
          error
            ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
            : "border-input focus-visible:border-ring focus-visible:ring-ring/30",
        )}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
