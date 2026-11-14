// Installation precedes runtime configuration; this is build-time presentation.
import identity from '../../../agent_cli/data/application_identity.json'

export const applicationName: string = identity.default_name
export const appText = (template: string): string => template.replaceAll('{app_name}', () => applicationName)
