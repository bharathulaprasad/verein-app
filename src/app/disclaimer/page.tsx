export default function DisclaimerPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                    Haftungsausschluss (Disclaimer)
                </h1>

                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">

                    {/* Disclaimer Sections */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">1. Haftungsbeschränkung </h2>
                        <p>
                            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                            allgemeinen Gesetzen verantwortlich...
                            [Die Inhalte des Internetauftritts der Siedlervereinigung Siemens Nürnberg e.V. wurden mit
                            größtmöglicher Sorgfalt und nach bestem Gewissen erstellt. Dennoch übernimmt der Anbieter dieser
                            Webseite keine Gewähr für die Aktualität, Vollständigkeit und Richtigkeit der bereitgestellten Seiten und
                            Inhalte.
                            Als Dienstanbieter ist der Anbieter dieser Webseite gemäß § 7 Abs. 1 TMG (Telemediengesetz) für eigene
                            Inhalte und bereitgestellte Informationen auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich;
                            nach den §§ 8 bis 10 TMG jedoch nicht verpflichtet, die übermittelten oder gespeicherten fremden
                            Informationen zu überwachen. Eine Entfernung oder Sperrung dieser Inhalte erfolgt umgehend ab dem
                            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung. Eine Haftung ist erst ab dem Zeitpunkt der
                            Kenntniserlangung möglich. ]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">2. Externe Links Haftung für Links</h2>
                        <p>
                            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben... [Die  Webseite  enthält  keine  „externe Links“ (Verlinkungen)  zu  anderen  Webseiten. ]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">3. Urheberrecht/Leistungsschutzrecht </h2>
                        <p>
                            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                            deutschen Urheberrecht... [Die auf dieser Webseite veröffentlichten Inhalte, Werke und bereitgestellten Informationen unterliegen
                            dem deutschen Urheberrecht und Leistungsschutzrecht. Jede Art der Vervielfältigung, Bearbeitung,
                            Verbreitung, Einspeicherung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
                            bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers. Das unerlaubte
                            Kopieren/Speichern der bereitgestellten Informationen auf diesen Webseiten ist nicht gestattet und
                            strafbar. ]
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">4. Datenschutz </h2>
                        <p>
                            Datenschutz [Durch den Besuch des Internetauftritts können Informationen (Datum, Uhrzeit, aufgerufene Seite) über
                            den Zugriff auf dem Server des Dienstanbieters gespeichert werden. Es werden hierbei keine personen
                            bezogenen Daten (z.B. Name, Anschrift oder E-Mail-Adresse), erhoben bzw. gespeichert.
                            Der Anbieter weist darauf hin, dass die Übertragung von Daten im Internet (z.B. per E-Mail) Sicherheits
                            lücken aufweisen und ein lückenloser Schutz der Daten vor dem Zugriff Dritter nicht gewährleistet werden
                            kann. Der Anbieter übernimmt keine Haftung für die durch solche Sicherheitslücken entstandenen
                            Schäden.
                            Der Verwendung der Kontaktdaten durch Dritte zur gewerblichen Nutzung wird ausdrücklich
                            widersprochen. Es sei denn, der Anbieter hat zuvor seine schriftliche Einwilligung erteilt.
                            Der Anbieter behält sich rechtliche Schritte für den Fall der unverlangten Zusendung von Werbe
                            informationen vor.  ]
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}