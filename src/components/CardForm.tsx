import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// ✅ Define the shape of your form data ONCE
export interface FormData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
}

interface FormErrors {
  cardNumber?: string;
  cardHolder?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
}

interface CardFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  isSubmitted: boolean;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  onCvcFocus: (focused: boolean) => void;
}

export const CardForm: React.FC<CardFormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  isSubmitted,
  setIsSubmitted,
  onCvcFocus,
}) => {
  const { toast } = useToast();

  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  // Focus retention
  const [focusState, setFocusState] = useState<{
    activeField: keyof FormData | null;
    cursorPosition: number;
  }>({ activeField: null, cursorPosition: 0 });

  const inputRefs = useRef<Record<keyof FormData, HTMLInputElement | null>>({
    cardNumber: null,
    cardHolder: null,
    expiryMonth: null,
    expiryYear: null,
    cvc: null,
  });

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .match(/.{1,4}/g)
      ?.join(" ") ?? "";

  const validateField = (
    field: keyof FormData,
    value: string,
    formData: FormData
  ): string | undefined => {
    switch (field) {
      case "cardNumber": {
        const num = value.replace(/\s/g, "");
        if (!num) return "Can't be blank";
        if (!/^\d{16}$/.test(num)) return "Must be 16 digits";
        return undefined;
      }

      case "cardHolder":
        if (!value.trim()) return "Cardholder name is required";
        if (value.trim().length < 3)
          return "Must be at least 3 characters long";
        if (value.length > 30) return "Must be be at most 30 characters";
        return undefined;

      case "expiryMonth": {
        const month = +value;
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const year = +formData.expiryYear;

        if (!value) return "Can't be blank";
        if (month < 1 || month > 12) return "Invalid month";
        if (year === currentYear && month < currentMonth) return "Month passed";
        return undefined;
      }

      case "expiryYear": {
        const yearVal = +value;
        const currentYearVal = new Date().getFullYear() % 100;
        const monthVal = +formData.expiryMonth;
        const currentMonthVal = new Date().getMonth() + 1;

        if (!value) return "Can't be blank";
        if (yearVal < currentYearVal) return "Year passed";
        if (
          yearVal === currentYearVal &&
          monthVal &&
          monthVal < currentMonthVal
        )
          return "Month passed";
        return undefined;
      }

      case "cvc":
        if (!value) return "Can't be blank";
        if (value.length < 3) return "Can't be less than 3 numbers";
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field as keyof FormData,
        formData[field as keyof FormData],
        formData
      );
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, setErrors]);

  useEffect(() => {
    const handleResize = () => {
      if (focusState.activeField && inputRefs.current[focusState.activeField]) {
        const input = inputRefs.current[focusState.activeField];
        if (input && document.contains(input)) {
          input.focus();
          input.setSelectionRange(
            focusState.cursorPosition,
            focusState.cursorPosition
          );
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [focusState]);

  const handleFocus = (
    field: keyof FormData,
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    setFocusState({
      activeField: field,
      cursorPosition: e.target.selectionStart || 0,
    });
  };

  const updateCursorPosition = (
    field: keyof FormData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (focusState.activeField === field) {
      requestAnimationFrame(() => {
        setFocusState((prev) => ({
          ...prev,
          cursorPosition: e.target.selectionStart || 0,
        }));
      });
    }
  };

  const handleInputBlur = (field: keyof FormData) => {
    setFocusState({ activeField: null, cursorPosition: 0 });
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    let newValue = value;

    if (field === "cardHolder") {
      // Prevent typing beyond 30 characters
      if (value.length > 30) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Maximum input is 30 characters.",
        }));
        return; // Don't update the value
      }

      // Allow only letters, spaces, apostrophes, hyphens, and dots
      newValue = value.replace(/[^a-zA-Z\s'.-]/g, "");
      // Replace multiple consecutive spaces with single space
      newValue = newValue.replace(/\s+/g, " ");
    }

    setFormData((prev) => ({ ...prev, [field]: newValue }));

    // Real-time validation
    const error = validateField(field, newValue, formData);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      cardNumber: true,
      cardHolder: true,
      expiryMonth: true,
      expiryYear: true,
      cvc: true,
    });
    if (validateForm()) {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Card confirmed.",
        duration: 3000,
      });
    }
  };

  const handleContinue = () => {
    setFormData({
      cardNumber: "",
      cardHolder: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setTouched({});
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex flex-col items-center space-y-6">
          <img
            src="/images/icon-complete.svg"
            alt="Complete"
            className="w-20 h-20"
          />
          <h2 className="text-[1.75rem] font-medium text-primary mb-4 tracking-[0.2em]">
            THANK YOU!
          </h2>
          <p className="text-lg" style={{ color: "hsl(212, 12%, 71%)" }}>
            We've added your card details
          </p>
          <Button
            onClick={handleContinue}
            className="w-full mt-12 h-14 text-lg"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cardholder */}
        <div className="space-y-2">
          <Label
            htmlFor="cardHolder"
            className="text-xs font-medium tracking-wider text-primary"
          >
            CARDHOLDER NAME
          </Label>
          <Input
            ref={(el) => (inputRefs.current.cardHolder = el)}
            id="cardHolder"
            placeholder="e.g. Wise Enesi"
            maxLength={30}
            value={formData.cardHolder}
            onChange={(e) => {
              handleChange("cardHolder", e.target.value);
              updateCursorPosition("cardHolder", e);
            }}
            onFocus={(e) => handleFocus("cardHolder", e)}
            onBlur={() => handleInputBlur("cardHolder")}
            className={`h-12 rounded-lg ${
              errors.cardHolder && touched.cardHolder
                ? focusState.activeField === "cardHolder"
                  ? "input-error-focused"
                  : "input-error-blurred"
                : focusState.activeField === "cardHolder"
                ? "input-gradient-border"
                : "border-2 border-border"
            } placeholder:text-muted-foreground text-primary text-lg font-medium`}
          />
          {errors.cardHolder && (
            <p className="text-xs" style={{ color: "hsl(0, 100%, 66%)" }}>
              {errors.cardHolder}
            </p>
          )}
        </div>

        {/* Card number */}
        <div className="space-y-2">
          <Label
            htmlFor="cardNumber"
            className="text-xs font-medium tracking-wider text-primary"
          >
            CARD NUMBER
          </Label>
          <Input
            ref={(el) => (inputRefs.current.cardNumber = el)}
            id="cardNumber"
            placeholder="e.g. 1234 5678 9123 0000"
            value={formData.cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              if (formatted.replace(/\s/g, "").length <= 16) {
                handleChange("cardNumber", formatted);
                updateCursorPosition("cardNumber", e);
              }
            }}
            onFocus={(e) => handleFocus("cardNumber", e)}
            onBlur={() => handleInputBlur("cardNumber")}
            className={`h-12 rounded-lg ${
              errors.cardNumber && touched.cardNumber
                ? focusState.activeField === "cardNumber"
                  ? "input-error-focused"
                  : "input-error-blurred"
                : focusState.activeField === "cardNumber"
                ? "input-gradient-border"
                : "border-2 border-border"
            } placeholder:text-muted-foreground text-primary text-lg font-medium`}
          />
          {errors.cardNumber && (
            <p className="text-xs" style={{ color: "hsl(0, 100%, 66%)" }}>
              {errors.cardNumber}
            </p>
          )}
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium tracking-wider text-primary">
              EXP. DATE (MM/YY)
            </Label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  ref={(el) => (inputRefs.current.expiryMonth = el)}
                  placeholder="MM"
                  maxLength={2}
                  value={formData.expiryMonth}
                  onChange={(e) => {
                    handleChange(
                      "expiryMonth",
                      e.target.value.replace(/\D/g, "")
                    );
                    updateCursorPosition("expiryMonth", e);
                  }}
                  onFocus={(e) => handleFocus("expiryMonth", e)}
                  onBlur={() => handleInputBlur("expiryMonth")}
                  className={`h-12 rounded-lg ${
                    errors.expiryMonth && touched.expiryMonth
                      ? focusState.activeField === "expiryMonth"
                        ? "input-error-focused"
                        : "input-error-blurred"
                      : focusState.activeField === "expiryMonth"
                      ? "input-gradient-border"
                      : "border-2 border-border"
                  } placeholder:text-muted-foreground text-primary text-lg font-medium`}
                />
                {errors.expiryMonth && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "hsl(0, 100%, 66%)" }}
                  >
                    {errors.expiryMonth}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Input
                  ref={(el) => (inputRefs.current.expiryYear = el)}
                  placeholder="YY"
                  maxLength={2}
                  value={formData.expiryYear}
                  onChange={(e) => {
                    handleChange(
                      "expiryYear",
                      e.target.value.replace(/\D/g, "")
                    );
                    updateCursorPosition("expiryYear", e);
                  }}
                  onFocus={(e) => handleFocus("expiryYear", e)}
                  onBlur={() => handleInputBlur("expiryYear")}
                  className={`h-12 rounded-lg ${
                    errors.expiryYear && touched.expiryYear
                      ? focusState.activeField === "expiryYear"
                        ? "input-error-focused"
                        : "input-error-blurred"
                      : focusState.activeField === "expiryYear"
                      ? "input-gradient-border"
                      : "border-2 border-border"
                  } placeholder:text-muted-foreground text-primary text-lg font-medium`}
                />
                {errors.expiryYear && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "hsl(0, 100%, 66%)" }}
                  >
                    {errors.expiryYear}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="cvc"
              className="text-xs font-medium tracking-wider text-primary"
            >
              CVC
            </Label>
            <Input
              ref={(el) => (inputRefs.current.cvc = el)}
              id="cvc"
              placeholder="e.g. 123"
              maxLength={4}
              value={formData.cvc}
              onChange={(e) => {
                handleChange("cvc", e.target.value.replace(/\D/g, ""));
                updateCursorPosition("cvc", e);
              }}
              onFocus={(e) => {
                handleFocus("cvc", e);
                onCvcFocus(true);
              }}
              onBlur={() => {
                handleInputBlur("cvc");
                onCvcFocus(false);
              }}
              className={`h-12 rounded-lg ${
                errors.cvc && touched.cvc
                  ? focusState.activeField === "cvc"
                    ? "input-error-focused"
                    : "input-error-blurred"
                  : focusState.activeField === "cvc"
                  ? "input-gradient-border"
                  : "border-2 border-border"
              } placeholder:text-muted-foreground text-primary text-lg font-medium`}
            />
            {errors.cvc && (
              <p
                className="text-xs mt-1"
                style={{ color: "hsl(0, 100%, 66%)" }}
              >
                {errors.cvc}
              </p>
            )}
          </div>
        </div>

        {/* <Button
          type="submit"
          disabled={
            Object.values(errors).some((error) => error) ||
            Object.values(formData).some((value) => !value.trim())
          }
          className={`w-full h-14 text-lg font-medium rounded-lg mt-8 transition-all duration-200 ${
            Object.values(errors).some((error) => error) ||
            Object.values(formData).some((value) => !value.trim())
              ? "opacity-50 blur-[0.5px] cursor-not-allowed"
              : "opacity-100 blur-0"
          }`}
        >
          Confirm
        </Button> */}
        <Button
          type="submit"
          className="w-full h-14 text-lg font-medium rounded-lg mt-8 transition-all duration-200"
        >
          Confirm
        </Button>
      </form>
    </div>
  );
};
