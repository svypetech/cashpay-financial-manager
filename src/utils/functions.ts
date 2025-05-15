import { formatDistanceToNow } from "date-fns";

export function shortenAddress(address: string, chars = 6): string {
  if (!address) return "-";

  if (address.length <= chars * 2 + 2) return address;

  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function timeAgo(dateString: string) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid Date";

    // Format the date as YYYY-MM-DD HH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};

export const formatNumberToTwoDecimals = (value: number): string => {
  if (isNaN(value)) return "0.00"; // Handle NaN case
  if (value === null || value === undefined) return "0.00"; // Handle null or undefined case
  const [whole, decimal] = value.toString().split(".");

  // If there's no decimal part, add .00
  if (!decimal) {
    return `${whole}.00`;
  }

  // If decimal part is shorter than 2 digits, pad with zeros
  if (decimal.length === 1) {
    return `${whole}.${decimal}0`;
  }

  // If decimal part is longer than 2 digits, truncate (not round)
  if (decimal.length > 2) {
    return `${whole}.${decimal.substring(0, 2)}`;
  }

  // Return the original number if it already has exactly 2 decimal places
  return `${whole}.${decimal}`;
};

export function cal_USDT_Value({
  balance,
  contract_decimals,
  quote_rate,
}: {
  balance: string;
  contract_decimals: number;
  quote_rate: number;
}) {
  const usdtValue = (Number(balance) / 10 ** contract_decimals) * quote_rate;
  return usdtValue;
}
