import { Card } from "@/components/ui/card";

interface CreditCardProps {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  isFlipped?: boolean;
}

export const CreditCard = ({
  cardNumber,
  cardHolder,
  expiryMonth,
  expiryYear,
  cvc,
  isFlipped = false,
}: CreditCardProps) => {
  const formatCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    return formatted || "0000 0000 0000 0000";
  };

  const formatExpiry = () => {
    const month = expiryMonth.padStart(2, "0") || "00";
    const year = expiryYear.padStart(2, "0") || "00";
    return `${month}/${year}`;
  };

  return (
    <div className="relative w-80 h-52 perspective-1000">
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-gpu preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div
            className="relative w-full h-full rounded-lg p-6 text-white overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-card-front.png')" }}
          >
            {/* Decorative circles */}
            <div className="absolute top-4 left-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-full"></div>
                <div className="w-6 h-6 bg-transparent rounded-full border-2 border-white"></div>
              </div>
            </div>

            {/* Card Number */}
            <div className="absolute top-24 left-6 right-6">
              <div className="text-[1.375rem] font-normal tracking-wider">
                {formatCardNumber(cardNumber)}
              </div>
            </div>

            {/* Card Details */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.15em]">
                  {cardHolder || "WISE ENESI"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium tracking-wider">
                  {formatExpiry()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div
            className="relative w-full h-full rounded-lg overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-card-back.png')" }}
          >
            {/* CVC area */}
            <div className="absolute top-[5.5rem] right-8">
              <div className="bg-white px-3 py-2 rounded text-black text-sm font-normal w-10 text-center">
                {cvc || "000"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
