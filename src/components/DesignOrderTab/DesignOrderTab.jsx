import React, { useState } from "react";

import DesignDeliverPage from "./DesignDeliverPage";
import DesignPaymentPage from "./DesignPaymentPage";
import ShippingInfo from "./ShippingInfo";
import { useNavigate } from "react-router-dom";
import DeliveryPage from "./DeliveryPage";

const DesignOrderTab = ({
  selectedSize,
  quantity,
  price,
  setPrice,
  design,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const steps = [
    { id: 1, path: `/design/payment/${design?._id}/shipping` },
    { id: 2, path: `/design/payment/${design?._id}/delivery` },
    { id: 3, path: `/design/payment/${design?._id}/payment` },
    // { id: 4, path: `payment/${checkoutId}/confirmation` },
  ];
  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    console.log("step", nextStep);

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
  if (!design) {
    return (
      <>
        <div>hello</div>
      </>
    );
  }
  return (
    <div style={{ width: "100%" }}>
      {currentStep === 1 && (
        <ShippingInfo
          price={price}
          setPrice={setPrice}
          onNextStep={handleNextStep}
        />
      )}
      {currentStep === 2 && (
        <DesignDeliverPage
          price={price}
          setPrice={setPrice}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
        />
      )}
      {currentStep === 3 && (
        <DesignPaymentPage
          selectedSize={selectedSize}
          quantity={quantity}
          price={price}
          design={design}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
        />
      )}
    </div>
  );
};

export default DesignOrderTab;
