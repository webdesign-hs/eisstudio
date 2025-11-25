import Link from 'next/link';

export default function DatenschutzPage() {
  return (
    <div className="legal-page">
      <div className="film-grain"></div>

      <div className="legal-container">
        <Link href="/coming-soon" className="legal-back">
          ← Zurück
        </Link>

        <h1 className="legal-title">Datenschutzerklärung</h1>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Datenschutz auf einen Blick</h2>
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Verantwortliche Stelle</h2>
            <p>
              <strong>sitNeis - Die Eismanufaktur</strong><br />
              [Vorname Nachname]<br />
              [Straße Hausnummer]<br />
              [PLZ Ort]<br />
              E-Mail: [E-Mail-Adresse]
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Datenerfassung auf dieser Website</h2>
            <h3>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h3>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
              Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>

            <h3>Wie erfassen wir Ihre Daten?</h3>
            <p>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei
              kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
            </p>
            <p>
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website
              durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B.
              Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Hosting</h2>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die
              personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den
              Servern des Hosters gespeichert.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Shop und Zahlungsabwicklung</h2>
            <p>
              Für unseren Online-Shop nutzen wir die Dienste von Shopify. Bei einer Bestellung
              werden Ihre Daten (Name, Adresse, Zahlungsdaten) an Shopify übermittelt und dort
              verarbeitet. Weitere Informationen finden Sie in der Datenschutzerklärung von
              Shopify:{' '}
              <a href="https://www.shopify.de/legal/datenschutz" target="_blank" rel="noopener noreferrer">
                https://www.shopify.de/legal/datenschutz
              </a>
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und
              Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem
              ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
            </p>
            <p>
              Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese
              jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten
              Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
              verlangen.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. SSL-/TLS-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
              vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte
              Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf
              „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <Link href="/impressum" className="legal-link">Impressum</Link>
        </div>
      </div>
    </div>
  );
}
