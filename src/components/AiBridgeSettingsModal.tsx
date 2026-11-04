'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, ShieldCheck, X } from 'lucide-react';

const copy: Record<string, [string,string,string,string,string,string]> = {
  en: ['Optional AI preference','BECOMING works without AI. Choosing AI is entirely optional.','I would like to use AI features when they are safely available.','No AI requests will be made yet. A secure server gateway, clear per-request consent, and privacy review are required before activation.','We do not sell personal data. Do not enter sensitive personal information for testing.','Save preference'],
  ar: ['اختيار الذكاء الاصطناعي','يعمل BECOMING دون ذكاء اصطناعي. استخدام AI اختياري بالكامل.','أرغب في استخدام ميزات AI عند توفرها بشكل آمن.','لن تُرسل أي طلبات AI الآن. يلزم خادم آمن وموافقة واضحة لكل إرسال ومراجعة الخصوصية أولاً.','لا نبيع البيانات الشخصية. لا تُدخل معلومات حساسة أثناء الاختبار.','حفظ الاختيار'],
  fr: ['Préférence IA facultative','BECOMING fonctionne sans IA. L’utilisation de l’IA est entièrement facultative.','Je souhaite utiliser les fonctionnalités IA lorsqu’elles seront disponibles en toute sécurité.','Aucune requête IA ne sera envoyée pour le moment. Une passerelle sécurisée, un consentement explicite et une vérification de confidentialité sont nécessaires.','Nous ne vendons pas de données personnelles. Évitez les données sensibles pendant les tests.','Enregistrer le choix'],
  es: ['Preferencia opcional de IA','BECOMING funciona sin IA. Su uso es totalmente opcional.','Quiero usar las funciones de IA cuando estén disponibles de forma segura.','Por ahora no se enviarán solicitudes de IA. Se requiere un servidor seguro, consentimiento explícito y revisión de privacidad.','No vendemos datos personales. No introduzcas datos sensibles durante las pruebas.','Guardar preferencia'],
  it: ['Preferenza AI facoltativa','BECOMING funziona senza AI. Usarla è del tutto facoltativo.','Vorrei usare le funzioni AI quando saranno disponibili in sicurezza.','Per ora non verranno inviate richieste AI. Servono un gateway sicuro, consenso esplicito e una revisione della privacy.','Non vendiamo dati personali. Evita dati sensibili durante i test.','Salva preferenza'],
};

export function AiBridgeSettingsModal() {
  const { isAiModalOpen, setAiModalOpen, aiSettings, setAiSettings, locale } = useApp();
  const [preference, setPreference] = useState(false);
  useEffect(() => { if (isAiModalOpen) setPreference(aiSettings.enabled); }, [isAiModalOpen, aiSettings.enabled]);
  if (!isAiModalOpen) return null;
  const t = copy[locale] || copy.en;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="ai-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-charcoal/60 backdrop-blur-sm">
      <div className="bg-ivory-50 dark:bg-stone-900 border border-stone-border dark:border-white/10 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-stone-charcoal dark:text-ivory-100 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="ai-modal-title" className="text-base font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4" />{t[0]}</h2>
          <button type="button" onClick={() => setAiModalOpen(false)} aria-label="Close"><X className="w-5 h-5"/></button>
        </div>
        <p className="text-sm">{t[1]}</p>
        <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-border dark:border-white/10">
          <input aria-label={t[2]} type="checkbox" checked={preference} onChange={e=>setPreference(e.target.checked)} className="mt-1"/>
          <span className="text-sm">{t[2]}</span>
        </label>
        <div role="status" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2 text-xs">
          <p className="flex gap-2 items-start"><ShieldCheck className="w-4 h-4 shrink-0"/>{t[3]}</p>
          <p>{t[4]}</p>
        </div>
        <button type="button" onClick={() => {setAiSettings({...aiSettings,enabled:preference});setAiModalOpen(false);}} className="px-4 py-2 w-full bg-violet-deep text-white rounded-xl font-semibold text-sm">{t[5]}</button>
      </div>
    </div>
  );
}
