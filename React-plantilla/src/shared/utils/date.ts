import {
  format,
  formatDistance,
  formatRelative,
  parseISO,
  isValid,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isThisYear,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  compareAsc,
  compareDesc,
  isBefore,
  isAfter,
  isEqual,
  max,
  min,
} from "date-fns";
import { es } from "date-fns/locale";
import { DATE_FORMATS } from "../constants/dateFormats";

/**
 * Parsea una fecha desde string o Date a objeto Date
 */
export const parseDate = (date: string | Date): Date => {
  if (date instanceof Date) return date;
  const parsed = parseISO(date);
  return isValid(parsed) ? parsed : new Date(date);
};

/**
 * Formatea una fecha según el formato especificado
 */
export const formatDate = (
  date: string | Date,
  formatStr: string = DATE_FORMATS.SHORT_DATE
): string => {
  try {
    const dateObj = parseDate(date);
    if (!isValid(dateObj)) return "Fecha inválida";
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha inválida";
  }
};

/**
 * Formatea una fecha de manera inteligente según su relación con hoy
 */
export const formatDateSmart = (date: string | Date): string => {
  try {
    const dateObj = parseDate(date);
    if (!isValid(dateObj)) return "Fecha inválida";

    if (isToday(dateObj)) {
      return `Hoy a las ${format(dateObj, DATE_FORMATS.TIME_24, {
        locale: es,
      })}`;
    }

    if (isYesterday(dateObj)) {
      return `Ayer a las ${format(dateObj, DATE_FORMATS.TIME_24, {
        locale: es,
      })}`;
    }

    if (isTomorrow(dateObj)) {
      return `Mañana a las ${format(dateObj, DATE_FORMATS.TIME_24, {
        locale: es,
      })}`;
    }

    if (isThisWeek(dateObj)) {
      return format(dateObj, "EEEE 'a las' HH:mm", { locale: es });
    }

    if (isThisYear(dateObj)) {
      return format(dateObj, "dd 'de' MMMM 'a las' HH:mm", { locale: es });
    }

    return format(dateObj, DATE_FORMATS.SHORT_DATETIME, { locale: es });
  } catch (error) {
    console.error("Error formatting date smart:", error);
    return "Fecha inválida";
  }
};

/**
 * Obtiene el tiempo relativo (hace 5 minutos, hace 2 horas, etc.)
 */
export const getRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = parseDate(date);
    if (!isValid(dateObj)) return "Fecha inválida";
    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: es });
  } catch (error) {
    console.error("Error getting relative time:", error);
    return "Fecha inválida";
  }
};

/**
 * Formatea la fecha de manera relativa al contexto (Hoy, Ayer, fecha)
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = parseDate(date);
    if (!isValid(dateObj)) return "Fecha inválida";
    return formatRelative(dateObj, new Date(), { locale: es });
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return "Fecha inválida";
  }
};

/**
 * Verifica si una fecha es válida
 */
export const isValidDate = (date: string | Date): boolean => {
  try {
    const dateObj = parseDate(date);
    return isValid(dateObj);
  } catch {
    return false;
  }
};

/**
 * Compara dos fechas
 * @returns -1 si date1 < date2, 0 si son iguales, 1 si date1 > date2
 */
export const compareDates = (
  date1: string | Date,
  date2: string | Date
): number => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  return compareAsc(d1, d2);
};

/**
 * Verifica si la primera fecha es anterior a la segunda
 */
export const isDateBefore = (
  date1: string | Date,
  date2: string | Date
): boolean => {
  return isBefore(parseDate(date1), parseDate(date2));
};

/**
 * Verifica si la primera fecha es posterior a la segunda
 */
export const isDateAfter = (
  date1: string | Date,
  date2: string | Date
): boolean => {
  return isAfter(parseDate(date1), parseDate(date2));
};

/**
 * Verifica si dos fechas son iguales
 */
export const areDatesEqual = (
  date1: string | Date,
  date2: string | Date
): boolean => {
  return isEqual(parseDate(date1), parseDate(date2));
};

/**
 * Obtiene la diferencia en días entre dos fechas
 */
export const getDaysDifference = (
  date1: string | Date,
  date2: string | Date
): number => {
  return differenceInDays(parseDate(date1), parseDate(date2));
};

/**
 * Obtiene la diferencia en horas entre dos fechas
 */
export const getHoursDifference = (
  date1: string | Date,
  date2: string | Date
): number => {
  return differenceInHours(parseDate(date1), parseDate(date2));
};

/**
 * Obtiene la diferencia en minutos entre dos fechas
 */
export const getMinutesDifference = (
  date1: string | Date,
  date2: string | Date
): number => {
  return differenceInMinutes(parseDate(date1), parseDate(date2));
};

/**
 * Añade días a una fecha
 */
export const addDaysToDate = (date: string | Date, days: number): Date => {
  return addDays(parseDate(date), days);
};

/**
 * Resta días a una fecha
 */
export const subtractDaysFromDate = (
  date: string | Date,
  days: number
): Date => {
  return subDays(parseDate(date), days);
};

/**
 * Añade meses a una fecha
 */
export const addMonthsToDate = (date: string | Date, months: number): Date => {
  return addMonths(parseDate(date), months);
};

/**
 * Resta meses a una fecha
 */
export const subtractMonthsFromDate = (
  date: string | Date,
  months: number
): Date => {
  return subMonths(parseDate(date), months);
};

/**
 * Obtiene el inicio del día
 */
export const getStartOfDay = (date: string | Date = new Date()): Date => {
  return startOfDay(parseDate(date));
};

/**
 * Obtiene el fin del día
 */
export const getEndOfDay = (date: string | Date = new Date()): Date => {
  return endOfDay(parseDate(date));
};

/**
 * Obtiene el inicio de la semana
 */
export const getStartOfWeek = (date: string | Date = new Date()): Date => {
  return startOfWeek(parseDate(date), { locale: es });
};

/**
 * Obtiene el fin de la semana
 */
export const getEndOfWeek = (date: string | Date = new Date()): Date => {
  return endOfWeek(parseDate(date), { locale: es });
};

/**
 * Obtiene el inicio del mes
 */
export const getStartOfMonth = (date: string | Date = new Date()): Date => {
  return startOfMonth(parseDate(date));
};

/**
 * Obtiene el fin del mes
 */
export const getEndOfMonth = (date: string | Date = new Date()): Date => {
  return endOfMonth(parseDate(date));
};

/**
 * Obtiene el inicio del año
 */
export const getStartOfYear = (date: string | Date = new Date()): Date => {
  return startOfYear(parseDate(date));
};

/**
 * Obtiene el fin del año
 */
export const getEndOfYear = (date: string | Date = new Date()): Date => {
  return endOfYear(parseDate(date));
};

/**
 * Obtiene la fecha más reciente de un array de fechas
 */
export const getMaxDate = (...dates: (string | Date)[]): Date => {
  return max(dates.map(parseDate));
};

/**
 * Obtiene la fecha más antigua de un array de fechas
 */
export const getMinDate = (...dates: (string | Date)[]): Date => {
  return min(dates.map(parseDate));
};

/**
 * Verifica si una fecha está en un rango
 */
export const isDateInRange = (
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  const d = parseDate(date);
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return isAfter(d, start) && isBefore(d, end);
};

/**
 * Formatea una duración en milisegundos a un formato legible
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Obtiene el nombre del día de la semana
 */
export const getWeekdayName = (date: string | Date): string => {
  return format(parseDate(date), "EEEE", { locale: es });
};

/**
 * Obtiene el nombre del mes
 */
export const getMonthName = (date: string | Date): string => {
  return format(parseDate(date), "MMMM", { locale: es });
};

/**
 * Convierte una fecha a ISO string
 */
export const toISOString = (date: string | Date): string => {
  return parseDate(date).toISOString();
};

/**
 * Obtiene el timestamp de una fecha
 */
export const getTimestamp = (date: string | Date = new Date()): number => {
  return parseDate(date).getTime();
};

/**
 * Verifica si es hoy
 */
export const checkIsToday = (date: string | Date): boolean => {
  return isToday(parseDate(date));
};

/**
 * Verifica si es ayer
 */
export const checkIsYesterday = (date: string | Date): boolean => {
  return isYesterday(parseDate(date));
};

/**
 * Verifica si es mañana
 */
export const checkIsTomorrow = (date: string | Date): boolean => {
  return isTomorrow(parseDate(date));
};

/**
 * Verifica si es esta semana
 */
export const checkIsThisWeek = (date: string | Date): boolean => {
  return isThisWeek(parseDate(date), { locale: es });
};

/**
 * Verifica si es este mes
 */
export const checkIsThisMonth = (date: string | Date): boolean => {
  return isThisMonth(parseDate(date));
};

/**
 * Verifica si es este año
 */
export const checkIsThisYear = (date: string | Date): boolean => {
  return isThisYear(parseDate(date));
};
