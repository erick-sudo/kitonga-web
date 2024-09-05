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

export const startsWithUpperCase = (str: string) =>
  !!str && /^[A-Z]+/.test(str);

export const containsWhiteSpaceCharacter = (str: string) => /\s+/.test(str);

export function joinArrays(
  inputString: string,
  delimiter: string,
  highLightClassName?: string
) {
  const result = [];

  const spanner = (str: string, idx: number) => <span key={idx}>{str}</span>;

  const highlight = (str: string, idx: number) => (
    <b key={idx} className={`${highLightClassName}`}>
      {str}
    </b>
  );

  if (!delimiter || !inputString) {
    return [inputString];
  }

  let match = inputString.match(new RegExp(delimiter, "i"));

  if (match) {
    if (!inputString.match(new RegExp(delimiter, "i"))![0]) {
      return [inputString];
    }
  } else {
    return [inputString];
  }

  let prev = 0;
  let index = 0;

  if (inputString.slice(prev, match.index)) {
    index += 1;
    result.push(spanner(inputString.slice(prev, match.index), index));
  }

  do {
    if (match) {
      index += 1;
      result.push(highlight(match[0], index));
    }

    prev += match.index! + match[0].length;

    match = inputString.slice(prev).match(new RegExp(delimiter, "i"));

    if (match) {
      index += 1;
      result.push(spanner(inputString.slice(prev, prev + match.index!), index));
    }
  } while (match);

  if (inputString.slice(prev)) {
    index += 1;
    result.push(spanner(inputString.slice(prev), index));
  }

  return result;
}
