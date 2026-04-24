export const metadata = {
  title: "SVS NBG e.V.",
  description: "Siedlervereinigung Siemens Nürnberg e.V.",
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          Datenschutzerklärung
        </h1>
        
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-4 mb-2">Allgemeine Hinweise</h3>
            <p className="leading-relaxed">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-4 mb-2">Verantwortliche Stelle</h3>
            <p className="leading-relaxed mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
              <strong>Siedlervereinigung Siemens Nürnberg e.V.</strong><br />
              
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">3. Datenerfassung auf unserer Website</h2>
            
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-4 mb-2">Cookies</h3>
            <p className="leading-relaxed">
              Unsere Website verwendet sogenannte „Cookies“. Das sind kleine Textdateien, die auf Ihrem Endgerät abgelegt werden. Wir nutzen ein Cookie, um Ihre Zustimmung zu unserem Cookie-Banner zu speichern (Einwilligungs-Cookie). Dieses wird lokal in Ihrem Browser (Local Storage) gespeichert.
            </p>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-6 mb-2">Kontaktformular (Vorstand Postfach)</h3>
            <p className="leading-relaxed">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten (Name, E-Mail-Adresse) zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p className="leading-relaxed mt-2">
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">4. Ihre Rechte</h2>
            <p className="leading-relaxed">
              Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}