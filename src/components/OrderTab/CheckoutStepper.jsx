import React from "react";

const CheckoutStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Shipping", completed: currentStep >= 1, path: "/shipping" },
    { id: 2, name: "Delivery", completed: currentStep >= 2, path: "/delivery" },
    { id: 3, name: "Payment", completed: currentStep >= 3, path: "/payment" },
  ];

  const styles = {
    container: {
      width: "100%",
      maxWidth: "768px",
      margin: "0 auto",
      //   padding: "24px",
    },
    stepperContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
    },
    progressLine: {
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      height: "2px",
      backgroundColor: "#4B5563",
      width: "100%",
      zIndex: 0,
    },
    stepsWrapper: {
      position: "relative",
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    stepItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    circle: (completed) => ({
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid",
      borderColor: completed ? "#F59E0B" : "#4B5563",
      backgroundColor: completed ? "#F59E0B" : "#111827",
      zIndex: 1,
      color: completed ? "#111827" : "#4B5563",
      fontSize: "16px",
    }),
    stepName: (completed) => ({
      marginTop: "8px",
      fontSize: "14px",
      fontWeight: 500,
      color: completed ? "#F59E0B" : "#9CA3AF",
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.stepperContainer}>
        <div style={styles.progressLine} />
        <div style={styles.stepsWrapper}>
          {steps.map((step) => (
            <div key={step.id} style={styles.stepItem}>
              <div style={styles.circle(step.completed)}>
                {step.completed && "✓"}
              </div>
              <span style={styles.stepName(step.completed)}>{step.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper;
