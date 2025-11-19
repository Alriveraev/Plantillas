import { useField } from "formik";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormikDatePickerProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

export const FormikDatePicker = ({
  name,
  label,
  placeholder = "Selecciona una fecha",
  disabled,
}: FormikDatePickerProps) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value
              ? format(new Date(field.value), "PPP", { locale: es })
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={(date) => helpers.setValue(date?.toISOString())}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {meta.touched && meta.error && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
};
