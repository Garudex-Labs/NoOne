import { expect, it } from 'vitest'

import { translateBotsIn } from './i18n-test-helper'

it.each([
  ['en', '1 bot', '2 bots', 'The bot is paused', 'The bot itself', '1 of 2 available'],
  ['ja', 'ボット1体', 'ボット2体', 'すべてのボット（1体）が一時停止中', 'からボット1体を外し', '2体中1体が利用可能'],
  ['zh', '1 个机器人', '2 个机器人', '全部 1 个机器人已暂停', '1 个机器人', '2 个中 1 个可用'],
  ['ar', 'روبوت واحد', 'روبوتان', 'الروبوت متوقف مؤقتًا', 'الروبوت نفسه', 'المتاح: 1 من 2'],
  ['fr', '1 bot', '2 bots', 'Le bot est en pause', 'Le bot et ses sessions', '1 sur 2 disponible'],
  ['de', '1 Bot', '2 Bots', 'Der Bot ist pausiert', 'Der Bot selbst', '1 von 2 verfügbar'],
  ['es', '1 bot', '2 bots', 'El bot está en pausa', 'El bot y sus sesiones', '1 de 2 disponible']
] as const)('renders a remaining member with singular grammar in %s', (locale, one, two, held, disband, available) => {
  const t = translateBotsIn(locale)

  expect(t('group.memberCount', 1)).toBe(one)
  expect(t('group.memberCount', 2)).toBe(two)
  expect(t('group.allHeldStatus', 1)).toBe(held)
  expect(t('group.availableCount', 1, 2)).toBe(available)
  expect(t('group.disbandDescSuffix', 1)).toContain(disband)
})

it.each([
  ['ar', [0, 3, 10, 11, 99, 100, 103], ['لا روبوتات', '3 روبوتات', '10 روبوتات', '11 روبوتًا', '99 روبوتًا', '100 روبوت', '103 روبوتات']]
] as const)('uses every bot-count form in %s', (locale, counts, expected) => {
  const t = translateBotsIn(locale)

  expect(counts.map(count => t('group.memberCount', count))).toEqual(expected)
})
