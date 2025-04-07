/**
 * Generates a book code based on category, author, and edition:
 * - First 3 letters of category
 * - First 3 letters of author's last name
 * - Last 2 digits of edition year
 * Example: "MAT-GAR-21" for Matemáticas, García, 2021
 */
export function generateCodigoFromInfo(
  category: string,
  author: string,
  edition: number,
): string {
  // Extract first 3 letters of category (uppercase)
  const categoryCode = category.substring(0, 3).toUpperCase();

  // Extract author's last name
  const lastNameRegex = /\s(\w+)$/;
  const lastNameExec = lastNameRegex.exec(author);
  let authorCode = "XXX"; // Default if no last name found

  if (lastNameExec?.[1]) {
    // First 3 letters of last name (uppercase)
    authorCode = lastNameExec[1].substring(0, 3).toUpperCase();
  } else {
    // If no space found, use first 3 letters of author
    authorCode = author.substring(0, 3).toUpperCase();
  }

  // Use edition number (last 2 digits)
  const editionStr = String(edition).padStart(2, "0");
  const editionCode = editionStr.substring(editionStr.length - 2);

  // Format as "CAT-AUT-ED"
  return `${categoryCode}-${authorCode}-${editionCode}`;
}
