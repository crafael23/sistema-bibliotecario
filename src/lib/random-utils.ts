export function cifraridentidad(identidad: string): string {
  const sustitucion: Record<string, string> = {
    "0": "z",
    "1": "y",
    "2": "x",
    "3": "w",
    "4": "v",
    "5": "u",
    "6": "t",
    "7": "s",
    "8": "r",
    "9": "q",
  };

  return identidad
    .split("")
    .map((char) => sustitucion[char] ?? char)
    .join("");
}

export function descifrarIdentidad(cifrado: string): string {
  const sustitucionInversa: Record<string, string> = {
    z: "0",
    y: "1",
    x: "2",
    w: "3",
    v: "4",
    u: "5",
    t: "6",
    s: "7",
    r: "8",
    q: "9",
  };

  return cifrado
    .split("")
    .map((char) => sustitucionInversa[char] ?? char)
    .join("");
}
