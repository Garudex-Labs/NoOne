import identity from '../../agent_cli/data/application_identity.json'

/** Build-time site presentation shares the application's packaged default. */
export const applicationName: string = identity.default_name
export const appText = (template: string): string => template.replaceAll('{app_name}', () => applicationName)
