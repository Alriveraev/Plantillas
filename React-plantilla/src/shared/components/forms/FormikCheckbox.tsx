import { useField } from "formik";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormikCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
}

export const FormikCheckbox = ({
  name,
  label,
  disabled,
}: FormikCheckboxProps) => {
  const [field, meta, helpers] = useField({ name, type: "checkbox" });

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        checked={field.value}
        onCheckedChange={(checked) => helpers.setValue(checked)}
        disabled={disabled}
      />
      <Label htmlFor={name} className="text-sm font-normal cursor-pointer">
        {label}
      </Label>
      {meta.touched && meta.error && (
        <p className="text-sm text-destructive ml-2">{meta.error}</p>
      )}
    </div>
  );
};
