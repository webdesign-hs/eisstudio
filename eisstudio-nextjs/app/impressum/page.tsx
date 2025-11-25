import Link from 'next/link';

export default function ImpressumPage() {
  return (
    <div className="legal-page">
      <div className="film-grain"></div>

      <div className="legal-container">
        <Link href="/coming-soon" className="legal-back">
          ← Zurück
        </Link>

        <h1 className="legal-title">Impressum</h1>

        <div className="legal-content">
          <section className="legal-section">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>sitNeis - Die Eismanufaktur</strong><br />
              [Vorname Nachname]<br />
              [Straße Hausnummer]<br />
              [PLZ Ort]
            </p>
          </section>

          <section className="legal-section">
            <h2>Kontakt</h2>
            <p>
              Telefon: [Telefonnummer]<br />
              E-Mail: [E-Mail-Adresse]
            </p>
          </section>

          <section className="legal-section">
            <h2>Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              [USt-IdNr.]
            </p>
          </section>

          <section className="legal-section">
            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              [Vorname Nachname]<br />
              [Straße Hausnummer]<br />
              [PLZ Ort]
            </p>
          </section>

          <section className="legal-section">
            <h2>EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section className="legal-section">
            <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <Link href="/datenschutz" className="legal-link">Datenschutz</Link>
        </div>
      </div>
    </div>
  );
}
