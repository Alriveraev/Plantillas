import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends React.ComponentProps<"input"> {
  label?: string;
  showLabel?: boolean;
  // Nuevas props para control externo (opcionales)
  showPassword?: boolean;
  onTogglePassword?: (show: boolean) => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      type,
      label,
      showLabel = true,
      disabled,
      showPassword,
      onTogglePassword,
      ...props
    },
    ref
  ) => {
    // Estado interno por defecto
    const [internalShow, setInternalShow] = React.useState(false);

    // Determinamos si es controlado (props) o no controlado (state interno)
    const isControlled = showPassword !== undefined;
    const isVisible = isControlled ? showPassword : internalShow;

    const toggleVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const newState = !isVisible;

      if (isControlled && onTogglePassword) {
        onTogglePassword(newState);
      } else {
        setInternalShow(newState);
      }
    };

    return (
      <div className="space-y-2">
        {label && showLabel && <Label htmlFor={props.id}>{label}</Label>}

        <div className="relative">
          <input
            type={isVisible ? "text" : "password"}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "pr-10", // Padding para el icono
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none",
              disabled &&
                "cursor-not-allowed opacity-50 hover:text-muted-foreground"
            )}
            tabIndex={-1}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {isVisible ? "Ocultar contraseña" : "Ver contraseña"}
            </span>
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
