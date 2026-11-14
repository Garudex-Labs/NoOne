import type { BillingTranslations } from './types_billing'

// Out-of-credits overlay copy (Nous vs. third-party providers), spread into en.ts.
export const hiBilling: BillingTranslations = {
  billingBlock: {
    titleNous: "Nous क्रेडिट समाप्त",
    titleProvider: provider => `क्रेडिट समाप्त — ${provider}`,
    fallbackMessage: "खाते के क्रेडिट समाप्त हैं। जारी रखने के लिए क्रेडिट जोड़ें।",
    openBilling: "बिलिंग खोलें",
    addCredits: "क्रेडिट जोड़ें",
    dismiss: "खारिज करें"
  }
}
