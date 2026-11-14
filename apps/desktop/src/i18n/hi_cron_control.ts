import type { CronControlCopy } from './types_cron_control'

export const hiCronControl: CronControlCopy = {
  stop: "रोकें",
  stopping: "बंद हो रहा है…",
  stopped: "कार्य रद्द हुआ",
  finishedFirst: "रोकने से पहले कार्य समाप्त हुआ",
  nothingToStop: "कोई कार्य नहीं चल रहा",
  failedStop: "कार्य रोका नहीं जा सका",
  lastCancelled: (reason: string) => (reason ? `पिछला कार्य रद्द: ${reason}` : "पिछला कार्य रद्द"),
  catchUpLabel: "छूटे हुए कार्य",
  catchUpHint: "{app_name} न चलने के दौरान छूटे कार्यों का क्या करना है।",
  catchUpChoices: {
    default: "डिफ़ॉल्ट उपयोग करें",
    run: "लौटने पर एक बार चलाएँ",
    skip: "छोड़ दें"
  }
}
