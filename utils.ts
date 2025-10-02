/**
 * Decodes a Base64 string, safely handling UTF-8 characters.
 * @param str The Base64 encoded string.
 * @returns The decoded string.
 */
export function base64Decode(str: string): string {
  try {
    // Use TextDecoder for robust UTF-8 support, which atob() lacks.
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Failed to decode base64 string:", e);
    return "Error: Could not decode file content.";
  }
}
