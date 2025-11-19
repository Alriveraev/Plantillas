import type { FormikProps } from "formik";

interface FormErrorProps {
  name: string;
  formik: FormikProps<any>;
}

export const FormError = ({ name, formik }: FormErrorProps) => {
  const error = formik.errors[name];
  const touched = formik.touched[name];

  if (!error || !touched) {
    return null;
  }

  return <legend className="text-[13px] text-destructive font-medium">{error as string}</legend>;
};
