import type { ZodSchema } from 'zod';
import { ZodError, type ZodIssue } from 'zod';

export function toFormikValidationSchema(schema: ZodSchema) {
  return (values: unknown) => {
    try {
      schema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        
        error.issues.forEach((err: ZodIssue) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        
        return errors;
      }
      
      return {};
    }
  };
}