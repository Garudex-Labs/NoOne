import { readFile, writeFile } from 'node:fs/promises'

/** Only generated site identity metadata changes; author-written pages do not. */
export async function syncApplicationIdentity({
  identityPath = new URL('../../agent_cli/data/application_identity.json', import.meta.url),
  configPath = new URL('../docs/docs.json', import.meta.url),
} = {}) {
  const identity = JSON.parse(await readFile(identityPath, 'utf8'))
  const config = JSON.parse(await readFile(configPath, 'utf8'))
  const before = JSON.stringify(config)
  config.name = identity.default_name
  config.variables = { ...config.variables, 'app-name': identity.default_name }
  function syncGroups(groups) {
    for (const group of groups ?? []) {
      if (group.pages?.includes('user-guide/cli') || group.pages?.includes('zh-Hans/user-guide/cli')) {
        group.group = `Using ${identity.default_name}`
      }
      syncGroups(group.pages?.filter((page) => typeof page === 'object'))
    }
  }
  for (const language of config.navigation?.languages ?? []) syncGroups(language.groups)
  if (JSON.stringify(config) === before) return
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n')
}
