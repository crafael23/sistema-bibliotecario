"use client";

import React from "react";
import { Check } from "lucide-react";

type StepIndicatorProps = {
  activeStep: number;
  totalSteps?: number;
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  activeStep,
  totalSteps = 2,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  activeStep === index + 1
                    ? "border-blue-500 bg-blue-100"
                    : activeStep > index + 1
                      ? "border-green-500 bg-green-100"
                      : "border-gray-300 bg-gray-100"
                }`}
              >
                {activeStep > index + 1 ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="ml-2">
                {index === 0 ? "Datos del Libro" : "Ejemplares"}
              </div>
            </div>

            {index < totalSteps - 1 && (
              <div className="mx-4 h-[2px] w-12 bg-gray-300"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
