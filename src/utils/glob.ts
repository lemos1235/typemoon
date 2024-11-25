/**
 * Converts a glob pattern to a regular expression string.
 *
 * @param glob - The glob pattern to convert.
 * @returns The equivalent regular expression string.
 */
export function globToRegex(glob: string): string {
  const escapeRegex = (str: string): string =>
    str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  let regexStr = "";
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i];
    switch (char) {
      case "*": {
        const nextChar = glob[i + 1];
        if (nextChar === "*") {
          regexStr += ".*";
          i++;
        } else {
          regexStr += "[^/\\\\]*";
        }
        break;
      }
      case "?": {
        regexStr += ".";
        break;
      }
      case "[":
      case "]": {
        regexStr += char;
        break;
      }
      default: {
        regexStr += escapeRegex(char);
      }
    }
  }
  return regexStr;
}
