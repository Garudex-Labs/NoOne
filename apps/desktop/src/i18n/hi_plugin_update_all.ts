import type { PluginUpdateAllTranslations } from './types_plugin_update'

/** Plugins tab: "Update all" and the auto-update switch. */
export const hiPluginUpdateAll: PluginUpdateAllTranslations = {
  updateAll: "सभी अपडेट करें",
  updatingAll: "अपडेट हो रहा है…",
  updateAllTip: "हर इंस्टॉल प्लगइन जाँचें और समीक्षा न माँगने वाले अपडेट लागू करें",
  updateAllDone: (updated: number, review: number, failed: number) =>
    `${updated} अपडेट हुए` + (review ? `, ${review} को समीक्षा चाहिए` : '') + (failed ? `, ${failed} विफल` : ''),
  updateAllNone: "सभी प्लगइन नवीनतम हैं",
  updateAllFailed: "प्लगइन अपडेट नहीं हो सके",
  autoUpdate: "स्वचालित अपडेट",
  autoUpdateTip: (hours: number) =>
    `गेटवे की जाँच पर प्लगइन अपडेट अपने आप लागू करें (हर ${hours} घंटे)। अपडेट कोड नए सत्रों में लोड होता है।`,
  autoUpdateFailed: "प्लगइन का स्वचालित अपडेट नहीं बदला जा सका"
}
