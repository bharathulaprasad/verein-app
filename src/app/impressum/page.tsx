export const metadata = {
  title: "Impressum | SVS NBG e.V.",
  description: "Impressum der Siedlervereinigung Siemens Nürnberg e.V.",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          Impressum
        </h1>
        
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Angaben gemäß § 5 TMG</h2>
            <p className="leading-relaxed">
              <strong>Siedlervereinigung Siemens Nürnberg e.V.</strong><br />
              Herpersdorfer straße 1b<br />
              90469 Nürnberg
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Vertreten durch den Vorstand:</h2>
            <p className="leading-relaxed">
              1. Vorsitzende/r: Thomas Konradt<br />
              2. Vorsitzende/r: Carolin Heelein<br />
              Kassierer/in:  Klaus Brendel
              1. Schriftfüre/r: Klaus Händler
              <br/>
              2. Schriftfürer/in : 
                 Madeleine Schulze-Erdei
              </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Kontakt</h2>
            <p className="leading-relaxed">
              Telefon: +49 1523 4337378<br />
              E-Mail: <a href="mailto:info@svs-nbg.de" className="text-blue-600 dark:text-blue-400 hover:underline">info@svs-nbg.de</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Registereintrag</h2>
            <p className="leading-relaxed">
              Eintragung im Vereinsregister.<br />
              Registergericht: [Amtsgericht Nürnberg]<br />
              Registernummer: [VR 12345]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="leading-relaxed">
             Thomas Konradt<br />
              Herpersdorfer straße 1b<br />
              90469 Nürnberg
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}