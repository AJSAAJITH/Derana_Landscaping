export const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "—"
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text
}
