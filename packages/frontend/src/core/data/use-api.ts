/**
 * Typing for http fetches
 * 
 * @param url 
 * @returns 
 */
export async function api<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}
