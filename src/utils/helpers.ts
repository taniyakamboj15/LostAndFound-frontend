import clsx, { ClassValue } from 'clsx';

// Combine class names
export const cn = (...inputs: ClassValue[]): string => {
  return clsx(inputs);
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Sleep function
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Deep clone object
export const deepClone = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};

// Remove undefined/null values from object
export const removeEmpty = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
  ) as Partial<T>;
};

// Group array by key
export const groupBy = <T,>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

// Sort array by key
export const sortBy = <T,>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
