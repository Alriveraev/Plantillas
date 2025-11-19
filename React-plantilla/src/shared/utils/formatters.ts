import { formatDate as formatDateUtil } from "./date";
import { DATE_FORMATS } from "../constants/dateFormats";

/**
 * Formatea un número como moneda
 */
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Formatea una fecha (wrapper para date-fns)
 */
export const formatDate = (
  date: string | Date,
  format: string = DATE_FORMATS.SHORT_DATE
): string => {
  return formatDateUtil(date, format);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("es-SV").format(num);
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea bytes a tamaño legible
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Trunca un texto con ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza la primera letra de un string
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitaliza cada palabra
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Formatea un número de teléfono
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return phone;
};

/**
 * Ofusca un email parcialmente
 */
export const obfuscateEmail = (email: string): string => {
  const [username, domain] = email.split("@");
  const visibleChars = Math.max(2, Math.floor(username.length / 3));
  const obfuscated = username.substring(0, visibleChars) + "***";
  return `${obfuscated}@${domain}`;
};

/**
 * Formatea un nombre completo desde partes
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};
