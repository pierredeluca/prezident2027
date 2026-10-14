export function typographie(text: string): string {
  return text
    .replace(/\s+([;:!?])/g, "\u202f$1")
    .replace(/«\s+/g, "«\u202f")
    .replace(/\s+»/g, "\u202f»")
    .replace(/(\d)\s+%/g, "$1\u00a0%");
}

export function htmlText(text: string): string {
  return typographie(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
