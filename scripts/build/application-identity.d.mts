export const defaultAppName: string
export function applicationIdentityHtml(): {
  name: string
  transformIndexHtml(html: string): string
}
