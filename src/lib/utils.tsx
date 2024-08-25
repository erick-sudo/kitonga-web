export function capitalize(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1, str.length) : "";
}

export function snakeCaseToTitleCase(inputString: string) {
  return inputString
    .split("_")
    .map((c) => capitalize(c))
    .join(" ");
}

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "KSH",
  });
};
