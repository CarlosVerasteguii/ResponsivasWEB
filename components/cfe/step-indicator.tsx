import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import React from "react"

interface Step {
  id: number
  name: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("mb-8 p-6 border bg-card rounded-cfe shadow-md", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center min-w-0 flex-1">
              {/* Círculo del paso */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 font-bold text-sm transition-all duration-200",
                  step.id === currentStep
                    ? "bg-cfe-green border-cfe-green text-cfe-text-on-green shadow-md scale-110"
                    : step.id < currentStep
                      ? "bg-cfe-green border-cfe-green text-cfe-text-on-green"
                      : "bg-background border-border text-muted-foreground",
                )}
              >
                {step.id < currentStep ? <Check className="w-6 h-6" /> : step.id}
              </div>

              {/* Nombre del paso */}
              <span
                className={cn(
                  "text-sm font-medium text-center leading-tight px-1",
                  step.id === currentStep
                    ? "text-cfe-green font-semibold"
                    : step.id < currentStep
                      ? "text-cfe-black"
                      : "text-muted-foreground",
                )}
              >
                {step.name}
              </span>
            </div>

            {/* Línea de conexión */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 mt-[-24px]">
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    step.id < currentStep ? "bg-cfe-green" : "bg-border",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Indicador textual del paso actual */}
      <div className="text-center mt-6 pt-4 border-t border-border">
        <p className="text-sm font-semibold text-cfe-green uppercase tracking-wide">
          PASO {currentStep} DE {steps.length}: {steps.find((s) => s.id === currentStep)?.name.toUpperCase()}
        </p>
      </div>
    </div>
  )
}

export default StepIndicator
