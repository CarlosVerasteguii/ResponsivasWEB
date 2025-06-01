import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"
import type React from "react"

type CfeAlertProps = {
  variant: "error" | "success" | "warning" | "info"
  title?: string
  message: string
  className?: string
}

const CfeAlert: React.FC<CfeAlertProps> = ({ variant, title, message, className }) => {
  const Icon = {
    error: XCircle,
    success: CheckCircle2,
    warning: AlertTriangle,
    info: Info,
  }[variant]

  const alertClasses = {
    error: "bg-destructive text-destructive-foreground border-destructive/50",
    success: "bg-cfe-green text-cfe-text-on-green border-cfe-green/50",
    warning: "bg-highlight-yellow text-foreground border-yellow-400", // Usar foreground para texto en fondo amarillo
    info: "bg-cfe-green-very-light text-cfe-green border-cfe-green/30",
  }

  return (
    <Alert className={cn(alertClasses[variant], "p-4 rounded-cfe", className)}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-grow">
          {title && <AlertTitle className="font-semibold mb-1">{title}</AlertTitle>}
          <AlertDescription className="text-sm">{message}</AlertDescription>
        </div>
      </div>
    </Alert>
  )
}

export default CfeAlert
