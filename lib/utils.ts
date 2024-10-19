import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";

// Utility to merge Tailwind classes
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Date and time formatting utility
export const formatDateTime = (
  dateString: Date
): {
  dateTime: string;
  dateOnly: string;
  timeOnly: string;
} => {
  const date = new Date(dateString);

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return {
    dateTime: date.toLocaleString("en-US", dateTimeOptions),
    dateOnly: date.toLocaleString("en-US", dateOptions),
    timeOnly: date.toLocaleString("en-US", timeOptions),
  };
};

// Converts a File object to a URL
export const convertFileToUrl = (file: File): string =>
  URL.createObjectURL(file);

// Price formatting utility with input validation
export const formatPrice = (price: string): string => {
  const amount = parseFloat(price);

  if (isNaN(amount)) {
    console.warn(`Invalid price value: "${price}"`);
    return "Invalid price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Parses query parameters only once to avoid redundancy
const parseQueryParams = (params: string) => qs.parse(params);

// Adds or updates a key-value pair in the URL query string
export function formUrlQuery({ params, key, value }: UrlQueryParams): string {
  const currentUrl = parseQueryParams(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// Removes specified keys from the URL query string
export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams): string {
  const currentUrl = parseQueryParams(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// Improved error handling with safer stringification and fallback handling
export const handleError = (error: unknown): never => {
  console.error(error);

  let errorMessage: string;

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    try {
      errorMessage = JSON.stringify(error);
    } catch {
      errorMessage = "An unknown error occurred";
    }
  }

  throw new Error(errorMessage);
};
