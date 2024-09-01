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

export function insertQueryParams(
  url: string,
  params: Record<string, string | number>
): string {
  const urlObj = new URL(url);

  const searchParams = new URLSearchParams(urlObj.search);

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  urlObj.search = searchParams.toString();

  return urlObj.toString();
}

export function csvString(
  dataArray: Record<string, string | number>[],
  keys: string[]
) {
  const initial: string[] = [];
  return [
    keys.map((k) => snakeCaseToTitleCase(k)).join(","),
    ...dataArray.reduce((acc, curr) => {
      acc.push(keys.map((key) => curr[key]).join(","));
      return acc;
    }, initial),
  ].join("\n");
}

export function array2d(
  dataArray: Record<string, string | number>[],
  keys: string[]
) {
  const initial: (string | number)[][] = [];
  return [
    keys.map((k) => snakeCaseToTitleCase(k)),
    ...dataArray.reduce((acc, curr) => {
      acc.push(keys.map((key) => curr[key]));
      return acc;
    }, initial),
  ];
}
