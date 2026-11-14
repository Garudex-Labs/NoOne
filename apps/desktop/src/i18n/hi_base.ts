import type { TranslationOverrides } from './define-locale'
import { hiAppTour } from './hi_app_tour'
import { hiBaseCapabilities } from './hi_base_capabilities'
import { hiBaseChrome } from './hi_base_chrome'
import { hiBaseCommandCenter } from './hi_base_command_center'
import { hiBaseConnectors } from './hi_base_connectors'
import { hiBaseMessaging } from './hi_base_messaging'
import { hiBaseOutputs } from './hi_base_outputs'
import { hiBaseProfiles } from './hi_base_profiles'
import { hiBilling } from './hi_billing'
import { hiBoot } from './hi_boot'
import { hiCatalog } from './hi_catalog'
import { hiConnectorCard } from './hi_connector_card'
import { hiGatewayGroupOpen, hiSkillDeepLink } from './hi_deep_links'
import { hiExternalOpenFailed } from './hi_external_open'
import { hiFirstRun } from './hi_first_run'
import { hiNotices } from './hi_notices'
import { hiSharedMetrics } from './hi_shared_metrics'

export const hiBase = {
  externalOpenFailed: hiExternalOpenFailed,
  sharedMetrics: hiSharedMetrics,
  appTour: hiAppTour,
  firstRun: hiFirstRun,
  intro: { stock: {}, custom: () => [] },
  connectors: hiConnectorCard,
  catalog: hiCatalog,
  boot: hiBoot.boot,
  skillDeepLink: hiSkillDeepLink,
  gatewayGroupOpen: hiGatewayGroupOpen,
  ...hiNotices,
  ...hiBilling,
  ...hiBaseCapabilities,
  ...hiBaseChrome,
  ...hiBaseCommandCenter,
  ...hiBaseConnectors,
  ...hiBaseMessaging,
  ...hiBaseOutputs,
  ...hiBaseProfiles
} satisfies TranslationOverrides
