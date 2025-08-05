import { useState } from "react";
import { CreditCard } from "@/components/CreditCard";
import { CardForm } from "@/components/CardForm";

const Index = () => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const handleCvcFocus = (focused: boolean) => {
    setIsCardFlipped(focused);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background images */}
      <div className="absolute inset-0">
        {/* Desktop background */}
        <div className="hidden lg:flex w-full h-full">
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-main-desktop.png')" }}
          ></div>
          <div className="w-2/3 h-full bg-background"></div>
        </div>

        {/* Mobile background */}
        <div
          className="lg:hidden w-full h-64 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bg-main-mobile.png')" }}
        ></div>
        <div
          className="lg:hidden w-full bg-background"
          style={{ minHeight: "calc(100vh - 16rem)" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Desktop layout */}
        <div className="hidden lg:flex justify-center items-center min-h-screen">
          <div className="relative flex w-full max-w-7xl px-8">
            {/* Credit card*/}
            <div className="absolute left-1/3 -translate-x-[70%] top-1/2 -translate-y-1/2">
              <CreditCard
                cardNumber={formData.cardNumber}
                cardHolder={formData.cardHolder}
                expiryMonth={formData.expiryMonth}
                expiryYear={formData.expiryYear}
                cvc={formData.cvc}
                isFlipped={isCardFlipped}
              />
            </div>

            {/* Left spacer to occupy left 1/3 */}
            <div className="flex-1"></div>

            {/* Form in right 2/3 */}
            <div className="flex-1 flex justify-center">
              <CardForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                isSubmitted={isSubmitted}
                setIsSubmitted={setIsSubmitted}
                onCvcFocus={handleCvcFocus}
              />
            </div>
            {/* form end */}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden">
          <div className="relative px-4 pt-8">
            <div className="flex justify-center mt-16">
              <CreditCard
                cardNumber={formData.cardNumber}
                cardHolder={formData.cardHolder}
                expiryMonth={formData.expiryMonth}
                expiryYear={formData.expiryYear}
                cvc={formData.cvc}
                isFlipped={isCardFlipped}
              />
            </div>
          </div>

          <div className="px-6 py-8">
            <CardForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              isSubmitted={isSubmitted}
              setIsSubmitted={setIsSubmitted}
              onCvcFocus={handleCvcFocus}
            />
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default Index;
