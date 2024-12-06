import React, { useState } from "react";

import DeliveryPage from "./DeliveryPage"; // You'll need to create this
import PaymentPage from "./PaymentPage";
import ShippingInfo from "./ShippingInfo";
import { useNavigate } from "react-router-dom";

const OrderTab = ({ checkoutId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const steps = [
    { id: 1, path: `/checkout/${checkoutId}/shipping` },
    { id: 2, path: `/checkout/${checkoutId}/delivery` },
    { id: 3, path: `/checkout/${checkoutId}/payment` },
    { id: 4, path: `/checkout/${checkoutId}/confirmation` },
  ];
  const handleNextStep = () => {
    const nextStep = currentStep + 1;

    setCurrentStep((prev) => prev + 1);
    setCurrentStep(nextStep);

    const nextRoute = steps.find((step) => step.id === nextStep)?.path;
    if (nextRoute) {
      navigate(nextRoute);
    }
  };
  const handlePreviousStep = () => {
    const prevStep = currentStep - 1;

    setCurrentStep((prev) => prev - 1);
    setCurrentStep(prevStep);

    const prevRoute = steps.find((step) => step.id === prevStep)?.path;
    if (prevRoute) {
      navigate(prevRoute);
    }
  };
  return (
    <div style={{ width: "100%" }}>
      {currentStep === 1 && <ShippingInfo onNextStep={handleNextStep} />}
      {currentStep === 2 && (
        <DeliveryPage
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
        />
      )}
      {currentStep === 3 && (
        <PaymentPage
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
        />
      )}
    </div>
  );
};

export default OrderTab;
