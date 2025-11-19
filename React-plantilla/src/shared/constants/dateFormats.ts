/**
 * Formatos de fecha estándar para la aplicación
 */
export const DATE_FORMATS = {
  // Formatos de fecha
  SHORT_DATE: "dd/MM/yyyy", // 25/03/2024
  LONG_DATE: "dd 'de' MMMM 'de' yyyy", // 25 de marzo de 2024
  MEDIUM_DATE: "dd MMM yyyy", // 25 Mar 2024
  ISO_DATE: "yyyy-MM-dd", // 2024-03-25

  // Formatos de hora
  TIME_12: "hh:mm a", // 03:30 PM
  TIME_24: "HH:mm", // 15:30
  TIME_WITH_SECONDS: "HH:mm:ss", // 15:30:45

  // Formatos de fecha y hora
  SHORT_DATETIME: "dd/MM/yyyy HH:mm", // 25/03/2024 15:30
  LONG_DATETIME: "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", // 25 de marzo de 2024 a las 15:30
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss", // 2024-03-25T15:30:45

  // Formatos relativos
  RELATIVE: "relative", // hace 5 minutos, hace 2 horas, etc.

  // Formatos especiales
  MONTH_YEAR: "MMMM yyyy", // marzo 2024
  DAY_MONTH: "dd MMM", // 25 Mar
  WEEKDAY: "EEEE", // lunes
  FULL: "EEEE, dd 'de' MMMM 'de' yyyy", // lunes, 25 de marzo de 2024
} as const;

export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS];
