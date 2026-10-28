'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, Compass } from 'lucide-react';

type Topic = 'calm' | 'habits' | 'care' | 'move' | 'learn' | 'create' | 'connect' | 'inspire' | 'reflect' | 'rest';
type Activity = { id: string; topic: Topic; title: string; idea: string; minutes: number };
const activities: Activity[] = [
  {id:'calm-breathe',topic:'calm',title:'A gentle breathing pause',idea:'Breathe comfortably and notice the air for two minutes. No breath holding needed.',minutes:2},
  {id:'calm-senses',topic:'calm',title:'Notice five things',idea:'Look around and name five ordinary things you can see.',minutes:3},
  {id:'calm-sounds',topic:'calm',title:'Listen to the room',idea:'Notice near and distant sounds without needing to change anything.',minutes:3},
  {id:'habit-read',topic:'habits',title:'Read one page',idea:'Pick something that interests you and read just one page.',minutes:5},
  {id:'habit-tidy',topic:'habits',title:'Reset a small space',idea:'Choose one surface and organize it gently.',minutes:5},
  {id:'habit-plan',topic:'habits',title:'Make tomorrow easier',idea:'Write one tiny practical step you might try tomorrow.',minutes:3},
  {id:'care-water',topic:'care',title:'A simple refresh',idea:'Take a comfortable pause, have some water if you want, and notice what you need.',minutes:3},
  {id:'care-boundary',topic:'care',title:'Give yourself permission',idea:'Write one thing you can postpone without guilt.',minutes:5},
  {id:'care-comfort',topic:'care',title:'Make a cozy corner',idea:'Find a comfortable place and spend a quiet moment there.',minutes:5},
  {id:'move-walk',topic:'move',title:'Curiosity walk',idea:'If it is safe and accessible, take a short walk and notice three details.',minutes:10},
  {id:'move-stretch',topic:'move',title:'Gentle stretching',idea:'Try a few comfortable movements within your range; stop if anything hurts.',minutes:5},
  {id:'move-dance',topic:'move',title:'Move to a favorite song',idea:'Choose music you enjoy and move however feels comfortable.',minutes:5},
  {id:'learn-question',topic:'learn',title:'Follow one question',idea:'Pick a question you are curious about and find one credible answer.',minutes:10},
  {id:'learn-word',topic:'learn',title:'Learn a new word',idea:'Discover a word in another language and try using it.',minutes:5},
  {id:'learn-fact',topic:'learn',title:'Explore a new topic',idea:'Read a short explanation of something outside your usual interests.',minutes:10},
  {id:'create-sketch',topic:'create',title:'Sketch without pressure',idea:'Draw an object near you. It does not have to look perfect.',minutes:5},
  {id:'create-story',topic:'create',title:'Start a tiny story',idea:'Write three lines about an imaginary place.',minutes:5},
  {id:'create-photo',topic:'create',title:'Capture a color',idea:'If you enjoy photography, find a beautiful color and take a picture.',minutes:5},
  {id:'connect-hello',topic:'connect',title:'Send a thoughtful hello',idea:'If you want, check in with someone you trust.',minutes:5},
  {id:'connect-memory',topic:'connect',title:'Remember a good moment',idea:'Think of a kind interaction and what made it meaningful.',minutes:3},
  {id:'connect-kind',topic:'connect',title:'One small kindness',idea:'Choose a simple helpful act that feels comfortable and appropriate.',minutes:10},
  {id:'inspire-music',topic:'inspire',title:'Listen to something uplifting',idea:'Play a favorite positive song or a short original audio reflection.',minutes:5},
  {id:'inspire-quote',topic:'inspire',title:'Write your own encouragement',idea:'Write a kind sentence you would say to a friend.',minutes:3},
  {id:'inspire-possibility',topic:'inspire',title:'Imagine a possibility',idea:'Name one enjoyable experience you might like to try someday.',minutes:5},
  {id:'reflect-gratitude',topic:'reflect',title:'Notice a bright spot',idea:'Write one thing that went reasonably well, however small.',minutes:3},
  {id:'reflect-values',topic:'reflect',title:'What matters today?',idea:'Name one value you want to bring into your next decision.',minutes:5},
  {id:'reflect-lesson',topic:'reflect',title:'One thing I learned',idea:'Write a thought or discovery from your day.',minutes:5},
  {id:'rest-silence',topic:'rest',title:'A screen-free pause',idea:'Put your device aside for a few minutes if that feels helpful.',minutes:5},
  {id:'rest-nature',topic:'rest',title:'A view of nature',idea:'Look outside or at a natural object and notice its details.',minutes:5},
  {id:'rest-unwind',topic:'rest',title:'An easy evening ritual',idea:'Choose a quiet activity you enjoy before resting.',minutes:10},
];
const topics: {id:Topic; label:string}[] = [
  {id:'calm',label:'Mindfulness & less stress'}, {id:'habits',label:'Better habits'},
  {id:'care',label:'Self-care'}, {id:'move',label:'Movement & walking'},
  {id:'learn',label:'Learn something'}, {id:'create',label:'Creativity'},
  {id:'connect',label:'Human connection'}, {id:'inspire',label:'Inspiration'},
  {id:'reflect',label:'Self-discovery'}, {id:'rest',label:'Rest & recharge'}
];
const localizedTopics: Record<string, string[]> = {
 en: ['Mindfulness & less stress','Better habits','Self-care','Movement & walking','Learn something','Creativity','Human connection','Inspiration','Self-discovery','Rest & recharge'],
 ar: ['اليقظة وتقليل التوتر','عادات أفضل','العناية بالنفس','الحركة والمشي','تعلّم شيئاً','الإبداع','التواصل مع الآخرين','الإلهام','اكتشاف الذات','الراحة والاسترخاء'],
 fr: ['Pleine conscience et sérénité','Bonnes habitudes','Prendre soin de soi','Bouger et marcher','Apprendre','Créativité','Relations humaines','Inspiration','Découverte de soi','Repos et détente'],
 es: ['Atención plena y calma','Mejores hábitos','Cuidado personal','Movimiento y paseos','Aprender','Creatividad','Conexión humana','Inspiración','Autoconocimiento','Descanso y bienestar'],
 it: ['Consapevolezza e calma','Abitudini migliori','Cura di sé','Movimento e passeggiate','Imparare','Creatività','Relazioni umane','Ispirazione','Scoperta di sé','Riposo e relax'],
};
const localizedUI: Record<string, Record<string,string>> = {
 ar: {'YOUR NEXT POSSIBILITY':'فرصتك التالية','min':'دقيقة','Discover something good for today':'اكتشف شيئاً مفيداً اليوم','Explore an activity that interests you. No pressure, streaks or mandatory points.':'اختر نشاطاً يثير اهتمامك بلا ضغط أو نقاط إلزامية.','What would you like to explore?':'ماذا تريد أن تستكشف؟','Try it offline':'سأجربها','Another idea':'اقتراح آخر','I tried it':'جربتها','Not for me':'لا يناسبني','Continue':'متابعة','Finish for now':'إنهاء الآن','Optional reflection':'ملاحظة اختيارية','Surprise me':'فاجئني','You gave it a try. What next?':'جرّبت نشاطاً، ماذا بعد؟','You can note what you noticed, or skip this.':'يمكنك تدوين ملاحظتك أو تخطيها.','You can put your phone away and try this. When you return, choose what fits.':'ضع الهاتف جانباً وجرّب النشاط. ثم عد واختر ما يناسبك.','Activities you chose to try:':'الأنشطة التي جربتها:','Activity history stays on this device. We do not infer your mental or medical state.':'يبقى سجل الأنشطة على هذا الجهاز، ولا نستنتج حالتك الصحية.','I would rather journal':'أفضل الكتابة'},
 fr: {'YOUR NEXT POSSIBILITY':'VOTRE PROCHAINE IDÉE','min':'min','Discover something good for today':'Découvrez une activité pour aujourd’hui','Explore an activity that interests you. No pressure, streaks or mandatory points.':'Explorez une activité sans pression ni obligation.','What would you like to explore?':'Que souhaitez-vous explorer ?','Try it offline':'Essayer hors ligne','Another idea':'Une autre idée','I tried it':'Je l’ai essayé','Not for me':'Pas pour moi','Continue':'Continuer','Finish for now':'Terminer','Optional reflection':'Réflexion facultative','Surprise me':'Surprenez-moi','You gave it a try. What next?':'Vous avez essayé. Et maintenant ?','You can note what you noticed, or skip this.':'Notez vos impressions ou passez cette étape.','You can put your phone away and try this. When you return, choose what fits.':'Posez votre téléphone et essayez. Revenez ensuite.','Activities you chose to try:':'Activités essayées :','Activity history stays on this device. We do not infer your mental or medical state.':'L’historique reste sur cet appareil. Nous n’évaluons pas votre santé.','I would rather journal':'Je préfère écrire'},
 es: {'YOUR NEXT POSSIBILITY':'TU PRÓXIMA IDEA','min':'min','Discover something good for today':'Descubre algo bueno para hoy','Explore an activity that interests you. No pressure, streaks or mandatory points.':'Explora una actividad sin presión ni obligaciones.','What would you like to explore?':'¿Qué te gustaría explorar?','Try it offline':'Probar sin conexión','Another idea':'Otra idea','I tried it':'Lo probé','Not for me':'No es para mí','Continue':'Continuar','Finish for now':'Terminar por ahora','Optional reflection':'Reflexión opcional','Surprise me':'Sorpréndeme','You gave it a try. What next?':'Lo has probado. ¿Y ahora?','You can note what you noticed, or skip this.':'Puedes anotar lo que notaste u omitirlo.','You can put your phone away and try this. When you return, choose what fits.':'Deja el móvil y prueba la actividad. Vuelve cuando quieras.','Activities you chose to try:':'Actividades probadas:','Activity history stays on this device. We do not infer your mental or medical state.':'El historial permanece en este dispositivo. No evaluamos tu salud.','I would rather journal':'Prefiero escribir'},
 it: {'YOUR NEXT POSSIBILITY':'LA TUA PROSSIMA IDEA','min':'min','Discover something good for today':'Scopri qualcosa di bello oggi','Explore an activity that interests you. No pressure, streaks or mandatory points.':'Esplora un’attività senza pressioni o obblighi.','What would you like to explore?':'Che cosa vuoi esplorare?','Try it offline':'Prova senza connessione','Another idea':'Un’altra idea','I tried it':'L’ho provata','Not for me':'Non fa per me','Continue':'Continua','Finish for now':'Termina per ora','Optional reflection':'Riflessione facoltativa','Surprise me':'Sorprendimi','You gave it a try. What next?':'Hai provato. E adesso?','You can note what you noticed, or skip this.':'Puoi annotare le tue impressioni o saltare.','You can put your phone away and try this. When you return, choose what fits.':'Metti via il telefono e prova. Torna quando vuoi.','Activities you chose to try:':'Attività provate:','Activity history stays on this device. We do not infer your mental or medical state.':'La cronologia resta sul dispositivo. Non valutiamo la tua salute.','I would rather journal':'Preferisco scrivere'},
};


// Display translations are keyed by the stable activity ID, not by saved history text.
const activityTitles: Record<string, string[]> = {
  ar: ['استراحة تنفس هادئة','لاحظ خمسة أشياء','أنصت للأصوات','اقرأ صفحة واحدة','رتب مساحة صغيرة','سهّل يوم الغد','استراحة منعشة','امنح نفسك الإذن','جهز ركناً مريحاً','نزهة فضولية','تمدد بلطف','تحرك على موسيقاك المفضلة','اتبع سؤالاً واحداً','تعلم كلمة جديدة','اكتشف موضوعاً جديداً','ارسم بلا ضغط','ابدأ قصة قصيرة','التقط لوناً','أرسل تحية لطيفة','تذكر لحظة جميلة','لفتة خير صغيرة','استمع لشيء ملهم','اكتب تشجيعاً لنفسك','تخيل إمكانية جديدة','لاحظ شيئاً جميلاً','ما الذي يهم اليوم؟','شيء تعلمته','استراحة بعيداً عن الشاشة','تأمل الطبيعة','طقس مسائي هادئ'],
  fr: ['Une pause pour respirer','Remarquez cinq choses','Écoutez les sons','Lisez une page','Rangez un petit espace','Préparez demain','Une pause rafraîchissante','Donnez-vous la permission','Créez un coin douillet','Promenade curieuse','Étirements doux','Bougez sur votre musique','Suivez une question','Apprenez un mot','Explorez un nouveau sujet','Dessinez sans pression','Commencez une petite histoire','Capturez une couleur','Envoyez un bonjour','Rappelez-vous un beau moment','Un petit geste gentil','Écoutez quelque chose de positif','Écrivez un encouragement','Imaginez une possibilité','Remarquez un moment agréable','Que compte-t-il aujourd’hui ?','Une chose apprise','Une pause sans écran','Contemplez la nature','Un rituel du soir paisible'],
  es: ['Una pausa para respirar','Observa cinco cosas','Escucha los sonidos','Lee una página','Ordena un espacio pequeño','Facilita el día de mañana','Una pausa refrescante','Date permiso','Crea un rincón acogedor','Paseo curioso','Estiramientos suaves','Muévete con tu música','Sigue una pregunta','Aprende una palabra','Explora un tema nuevo','Dibuja sin presión','Empieza una pequeña historia','Captura un color','Envía un saludo amable','Recuerda un buen momento','Un pequeño gesto amable','Escucha algo positivo','Escribe unas palabras de ánimo','Imagina una posibilidad','Observa algo positivo','¿Qué importa hoy?','Algo que aprendí','Una pausa sin pantallas','Observa la naturaleza','Un ritual tranquilo por la noche'],
  it: ['Una pausa per respirare','Nota cinque cose','Ascolta i suoni','Leggi una pagina','Riordina un piccolo spazio','Semplifica domani','Una pausa rinfrescante','Concediti il permesso','Crea un angolo accogliente','Passeggiata curiosa','Stretching delicato','Muoviti con la tua musica','Segui una domanda','Impara una parola nuova','Esplora un nuovo argomento','Disegna senza pressioni','Inizia una breve storia','Cattura un colore','Invia un saluto gentile','Ricorda un bel momento','Un piccolo gesto gentile','Ascolta qualcosa di positivo','Scrivi un incoraggiamento','Immagina una possibilità','Nota qualcosa di bello','Cosa conta oggi?','Una cosa che ho imparato','Una pausa senza schermi','Osserva la natura','Un tranquillo rituale serale'],
};
const activityIdeas: Record<string, string[]> = {
  ar: ['تنفس براحة ولاحظ الهواء لدقيقتين دون حبس النفس.','انظر حولك وسمّ خمسة أشياء تراها.','أنصت إلى الأصوات القريبة والبعيدة دون محاولة تغييرها.','اختر شيئاً يثير اهتمامك واقرأ صفحة واحدة.','اختر سطحاً صغيراً ورتبه بهدوء.','اكتب خطوة بسيطة يمكنك تجربتها غداً.','خذ استراحة واشرب ماءً إذا رغبت ولاحظ احتياجاتك.','اكتب شيئاً واحداً يمكنك تأجيله دون شعور بالذنب.','ابحث عن مكان مريح واجلس فيه قليلاً.','إذا كان المكان آمناً ومناسباً، امش قليلاً ولاحظ ثلاثة تفاصيل.','جرب حركات لطيفة ضمن راحتك وتوقف إذا شعرت بألم.','اختر موسيقى تحبها وتحرك بالطريقة المريحة لك.','اختر سؤالاً يثير فضولك وابحث عن إجابة موثوقة.','تعرف على كلمة بلغة أخرى وجرب استخدامها.','اقرأ شرحاً قصيراً لموضوع غير مألوف.','ارسم شيئاً قريباً منك دون السعي للكمال.','اكتب ثلاثة أسطر عن مكان خيالي.','ابحث عن لون جميل والتقط له صورة إن رغبت.','تواصل مع شخص تثق به إذا أحببت.','تذكر تفاعلاً لطيفاً وما جعله جميلاً.','اختر مساعدة بسيطة ومناسبة تستطيع تقديمها.','استمع إلى موسيقى إيجابية أو تأمل صوتي قصير.','اكتب جملة مشجعة تقولها لصديق.','اذكر تجربة ممتعة قد ترغب بها مستقبلاً.','اكتب شيئاً سار بشكل جيد ولو كان صغيراً.','اذكر قيمة تريد أن توجه قرارك التالي.','اكتب فكرة أو اكتشافاً تعلمته اليوم.','ضع جهازك جانباً لبضع دقائق إن ناسبك.','انظر للخارج أو إلى شيء طبيعي ولاحظ تفاصيله.','اختر نشاطاً هادئاً تستمتع به قبل النوم.'],
  fr: ['Respirez naturellement deux minutes, sans retenir votre souffle.','Regardez autour de vous et nommez cinq objets visibles.','Écoutez les sons proches et lointains sans les modifier.','Choisissez un sujet intéressant et lisez une page.','Choisissez une surface et rangez-la tranquillement.','Notez une toute petite étape pour demain.','Faites une pause et buvez de l’eau si vous le souhaitez.','Notez une chose que vous pouvez remettre à plus tard.','Trouvez un endroit confortable et profitez-en un instant.','Si cela vous convient, marchez un peu et observez trois détails.','Faites des mouvements doux, arrêtez si cela fait mal.','Choisissez une musique agréable et bougez librement.','Posez une question et trouvez une réponse fiable.','Découvrez un mot dans une autre langue et utilisez-le.','Lisez un court texte sur un sujet inhabituel.','Dessinez un objet proche sans viser la perfection.','Écrivez trois lignes sur un lieu imaginaire.','Trouvez une jolie couleur et photographiez-la si vous aimez.','Prenez des nouvelles d’une personne de confiance.','Repensez à un échange agréable et à ce qui l’a rendu précieux.','Choisissez un petit geste utile, adapté à votre situation.','Écoutez une musique positive ou une courte réflexion audio.','Écrivez une phrase encourageante pour un ami.','Imaginez une expérience agréable à tenter un jour.','Notez une chose qui s’est plutôt bien passée.','Nommez une valeur pour guider votre prochaine décision.','Notez une découverte de votre journée.','Mettez votre appareil de côté quelques minutes, si possible.','Regardez dehors ou un objet naturel et observez les détails.','Choisissez une activité tranquille avant de vous reposer.'],
  es: ['Respira cómodamente durante dos minutos, sin contener el aire.','Mira alrededor y nombra cinco objetos que veas.','Escucha sonidos cercanos y lejanos sin cambiarlos.','Elige algo interesante y lee una página.','Ordena con calma una superficie pequeña.','Escribe un paso sencillo para mañana.','Haz una pausa y bebe agua si te apetece.','Escribe algo que puedes posponer sin culpa.','Busca un lugar cómodo y disfruta un momento.','Si es seguro, camina un poco y observa tres detalles.','Haz movimientos suaves y para si algo duele.','Elige música que disfrutes y muévete con comodidad.','Elige una pregunta y busca una respuesta fiable.','Aprende una palabra en otro idioma y úsala.','Lee una explicación breve sobre un tema nuevo.','Dibuja algo cercano sin buscar la perfección.','Escribe tres líneas sobre un lugar imaginario.','Encuentra un color bonito y fotografíalo si quieres.','Saluda a alguien de confianza si te apetece.','Recuerda una interacción amable y por qué fue especial.','Elige un pequeño gesto útil y apropiado.','Escucha música positiva o una reflexión breve.','Escribe una frase de ánimo para un amigo.','Imagina una experiencia agradable que quieras probar.','Anota algo que haya salido bastante bien.','Nombra un valor para tu próxima decisión.','Escribe algo que hayas descubierto hoy.','Deja el dispositivo a un lado unos minutos si te ayuda.','Mira afuera o un objeto natural y observa los detalles.','Elige una actividad tranquila para relajarte.'],
  it: ['Respira comodamente per due minuti, senza trattenere il fiato.','Guardati intorno e nomina cinque oggetti che vedi.','Ascolta suoni vicini e lontani senza cambiarli.','Scegli qualcosa che ti interessa e leggi una pagina.','Riordina con calma una piccola superficie.','Scrivi un semplice passo per domani.','Fai una pausa e bevi acqua se ti va.','Scrivi una cosa che puoi rimandare senza sentirti in colpa.','Trova un posto comodo e fermati un momento.','Se è sicuro, cammina un po’ e nota tre dettagli.','Fai movimenti delicati e fermati se senti dolore.','Scegli musica piacevole e muoviti a tuo agio.','Scegli una domanda e cerca una risposta affidabile.','Scopri una parola in un’altra lingua e usala.','Leggi una breve spiegazione su qualcosa di nuovo.','Disegna un oggetto vicino senza cercare la perfezione.','Scrivi tre righe su un luogo immaginario.','Trova un bel colore e fotografalo se vuoi.','Saluta una persona di fiducia se ti va.','Ricorda un incontro gentile e cosa lo ha reso speciale.','Scegli un piccolo gesto utile e appropriato.','Ascolta musica positiva o una breve riflessione.','Scrivi una frase incoraggiante per un amico.','Immagina un’esperienza piacevole da provare un giorno.','Annota qualcosa che è andato abbastanza bene.','Nomina un valore per la tua prossima decisione.','Scrivi una scoperta fatta oggi.','Metti da parte il dispositivo per qualche minuto, se ti aiuta.','Guarda fuori o un oggetto naturale e nota i dettagli.','Scegli un’attività tranquilla prima del riposo.'],
};
export const activityLabel = (locale: string, id: string, field: 'title'|'idea') => {
  const index = activities.findIndex(activity => activity.id === id);
  const values = field === 'title' ? activityTitles[locale] : activityIdeas[locale];
  return index >= 0 ? values?.[index] : undefined;
};

const SEEN_KEY = 'becoming_activity_seen_v1';
const TRIED_KEY = 'becoming_activity_tried_v1';
const JOURNEY_KEY = 'becoming_activity_journey_v1';
type JourneyRecord = { id:string; title:string; date:string; reflection?:string };
function storeJourney(activity:Activity, store: Storage, key: string, reflection?:string) {
  try {
    const raw:unknown = JSON.parse(store.getItem(key)||'[]');
    const existing:JourneyRecord[] = Array.isArray(raw) ? raw.filter((v):v is JourneyRecord => typeof v==='object'&&v!==null&&typeof v.id==='string'&&typeof v.title==='string') : [];
    const entry:JourneyRecord = {id:activity.id,title:activity.title,date:new Date().toISOString(),...(reflection?.trim()?{reflection:reflection.trim()}:{})};
    const latestIndex = reflection !== undefined ? existing.findIndex(v => v.id === activity.id && !v.reflection) : -1;
    const next = latestIndex >= 0 ? existing.map((v,i) => i === latestIndex ? {...v,reflection:reflection?.trim() || undefined} : v) : [entry,...existing].slice(0,100);
    store.setItem(key,JSON.stringify(next));
    window.dispatchEvent(new Event('becoming-activity-journey-updated'));
  } catch { /* private browsing may not persist */ }
}
function readIds(key:string, store: Storage): string[] {
  try { const value: unknown = JSON.parse(store.getItem(key) || '[]'); return Array.isArray(value) ? value.filter((v):v is string=>typeof v==='string').slice(-100) : []; } catch { return []; }
}
export function TodayNeeds() {
  const {locale, setActiveTab, setActiveMode, addMoment, storageMode, user} = useApp();
  const t = (label: string) => localizedUI[locale]?.[label] || label;
  const scoped = (key: string) => user?.id ? `${key}_${user.id}` : key;
  const getStore = () => storageMode === 'local' ? localStorage : sessionStorage;
  const [topic,setTopic] = useState<Topic>('calm');
  const [seen,setSeen] = useState<string[]>([]);
  const [tried,setTried] = useState<string[]>([]);
  const [selected,setSelected] = useState<string | null>(null);
  const [offset,setOffset] = useState(0);
  const [reviewing,setReviewing] = useState<Activity | null>(null);
  const [reflection,setReflection] = useState('');
  useEffect(()=>{
    const store = storageMode === 'local' ? localStorage : sessionStorage;
    setSeen(readIds(user?.id ? `${SEEN_KEY}_${user.id}` : SEEN_KEY,store));
    setTried(readIds(user?.id ? `${TRIED_KEY}_${user.id}` : TRIED_KEY,store));
    setSelected(null);
    setReviewing(null);
    setReflection('');
    setOffset(0);
  },[storageMode,user?.id]);
  const ordered = useMemo(()=> {
    const byTopic = activities.filter(a=>a.topic===topic);
    return [...byTopic.filter(a=>!seen.includes(a.id)),...byTopic.filter(a=>seen.includes(a.id))];
  },[topic,seen]);
  const suggestion = ordered[offset % Math.max(ordered.length,1)];
  const topicExhausted = activities.filter(a=>a.topic===topic).every(a=>seen.includes(a.id));
  const mark = (key:string, current:string[], id:string, update:(v:string[])=>void) => {
    const next = Array.from(new Set([...current,id])).slice(-100);
    update(next);
    try {getStore().setItem(scoped(key),JSON.stringify(next));} catch { /* optional activity history */ }
  };
  const another = () => { if(suggestion) mark(SEEN_KEY,seen,suggestion.id,setSeen); setSelected(null);setOffset(n=>topicExhausted?n+1:0); };
  const finishReview = () => { if (reviewing) storeJourney(reviewing,getStore(),scoped(JOURNEY_KEY),reflection); if (reflection.trim()) addMoment(reflection.trim()); setReflection('');setReviewing(null);another(); };
  const completedActivity = () => {if(!suggestion) return;mark(TRIED_KEY,tried,suggestion.id,setTried);mark(SEEN_KEY,seen,suggestion.id,setSeen);storeJourney(suggestion,getStore(),scoped(JOURNEY_KEY));setReviewing(suggestion);setSelected(null);};
  return (
    <section aria-labelledby="becoming-today-needs" className="relative z-10 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 p-4 sm:p-5 text-start space-y-3">
      <h2 id="becoming-today-needs" className="font-serif font-bold text-xl text-slate-900 dark:text-white">{t('Discover something good for today')}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">{t('Explore an activity that interests you. No pressure, streaks or mandatory points.')}</p>
      <label htmlFor="activity-topic" className="block text-sm font-semibold text-slate-800 dark:text-white">{t('What would you like to explore?')}</label>
      <select id="activity-topic" value={topic} onChange={e=>{setTopic(e.target.value as Topic);setOffset(0);setSelected(null);setReviewing(null);setReflection('');}} className="w-full min-h-12 rounded-xl border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 text-sm">
        {topics.map(t=><option value={t.id} key={t.id}>{localizedTopics[locale]?.[topics.findIndex(x=>x.id===t.id)] || t.label}</option>)}
      </select>
      {suggestion && <div className="rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-amber-800 dark:text-amber-300">{t('YOUR NEXT POSSIBILITY')}</span><span className="text-xs text-slate-500 dark:text-slate-300">{suggestion.minutes} {t('min')}</span></div>
        <h3 className="font-semibold text-base text-slate-900 dark:text-white">{activityLabel(locale,suggestion.id,'title') || suggestion.title}</h3>
        <p className="text-sm text-slate-700 dark:text-slate-200">{activityLabel(locale,suggestion.id,'idea') || suggestion.idea}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button type="button" onClick={()=>{setSelected(suggestion.id);}} className="min-h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold px-3">{t('Try it offline')}</button>
          <button type="button" onClick={another} className="min-h-11 rounded-xl border border-stone-300 dark:border-slate-600 text-slate-800 dark:text-white text-sm font-semibold px-3 flex items-center justify-center gap-2"><Sparkles className="w-4 h-4"/>{t('Another idea')}</button>
        </div>
        {selected===suggestion.id && <div className="border-t border-stone-200 dark:border-slate-600 pt-3 space-y-2" aria-live="polite">
          <p className="text-sm text-slate-700 dark:text-slate-200">{t('You can put your phone away and try this. When you return, choose what fits.')}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={completedActivity} className="min-h-11 bg-emerald-800 text-white rounded-xl px-2 text-sm font-semibold">{t('I tried it')}</button>
            <button type="button" onClick={another} className="min-h-11 border border-stone-300 dark:border-slate-600 text-slate-800 dark:text-white rounded-xl px-2 text-sm">{t('Not for me')}</button>
          </div>
        </div>}
      </div>}
      {reviewing && <div className="rounded-xl border border-emerald-700/40 bg-emerald-50 dark:bg-slate-800 p-3 space-y-2" aria-live="polite">
        <h3 className="font-semibold text-slate-900 dark:text-white">{t('You gave it a try. What next?')}</h3>
        <p className="text-sm text-slate-700 dark:text-slate-200">{activityLabel(locale,reviewing.id,'title') || reviewing.title}. {t('You can note what you noticed, or skip this.')}</p>
        <label htmlFor="activity-reflection" className="block text-sm text-slate-700 dark:text-slate-200">{t('Optional reflection')}</label>
        <textarea id="activity-reflection" rows={2} maxLength={500} value={reflection} onChange={e=>setReflection(e.target.value)} className="w-full rounded-xl p-3 border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={finishReview} className="min-h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold">{t('Continue')}</button>
          <button type="button" onClick={()=>{setReflection('');setReviewing(null);}} className="min-h-11 rounded-xl border border-stone-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm">{t('Finish for now')}</button>
        </div>
      </div>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500 dark:text-slate-300">{t('Activities you chose to try:')} {tried.length}</p>
        <button type="button" onClick={()=>{setTopic(topics[(topics.findIndex(t=>t.id===topic)+1)%topics.length].id);setOffset(0);setSelected(null);setReviewing(null);setReflection('');}} className="text-xs font-semibold underline text-amber-800 dark:text-amber-300 flex items-center gap-1"><Compass className="w-4 h-4"/>{t('Surprise me')}</button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{t('Activity history stays on this device. We do not infer your mental or medical state.')}</p>
      <button type="button" onClick={()=>{setActiveTab('home');setActiveMode('journal');}} className="text-xs underline text-slate-600 dark:text-slate-300">{t('I would rather journal')}</button>
    </section>
  );
}
