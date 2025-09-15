import "./AboutUs.scss"

import charte from "../assets/doc/Charte_VF.pdf";
import statut from "../assets/doc/status.pdf";

export function AboutUs() {
    return <div id="container-about-us" style={{ textAlign: "left" }}>
        <div>
            <h2>Le Rézal</h2>
            <p>Le Rézal est l'association chargée de l'exploitation du réseau informatique de la Maison des Mines et des Ponts, par délégation de la direction.</p>
        </div>
        <div>
            <h2>Se connecter au réseau</h2>
            <p>
                Le nom du réseau pour les cotisants est <b>Rezal</b>.
                Il suffit d'entrer un login et un mot de passe et s'ils correspondent à un compte approuvé par l'association alors l'accès est confirmé et l'appareil a accès à Internet.
            </p>
        </div>
        <div>
            <h2>Cotisation</h2>
            La cagnote est <a
                style={{ color: "blue", marginLeft: "3px" }}
                href="https://www.helloasso.com/associations/rezal/adhesions/cotisations-rezal-25-26"
            >ici</a>, sur HellAsso.
            <h3>Pourquoi une cotisation ?</h3>
            <p>
                La cotisation est nécessaire pour que l'association puisse payer les frais des abonnements WiFi, renouveller ses équipements, et constituer un fond de secours en cas de défaillance soudaine d'équipements essentiels.<br />
                Une fois que vous avez cotisé, un membre du bureau peut activer l'accès au wifi sur votre compte. Actuellement, la cotisation se fait sur une durée <b>trimestrielle: 5€/trimestre</b> , selon le découpage suivant :
            </p>
            <p>
                <ul>
                    <li>Trimestre 1 : 10 Septembre - 1 Janvier</li>
                    <li>Trimestre 2 : 1 Janvier - 1 Avril</li>
                    <li>Trimestre 3 : 1 Avril - 15 Juillet</li>
                </ul>

                Lorsque vous avez cotisé pour un trimestre, plus rien à faire !
            </p>
            <h3>Comment cotiser ?</h3>
            <p>
                La cotisation se fait par paiement via HelloAsso, ou par chèque ou par espèces, directement dans une chambre ou dans une boite aux lettres d'un membre du bureau restreint.
            </p>
        </div>
        <div>
            <h2>Prêts d'équipements</h2>
            <p>
                L'association dispose de quelques équipements qu'elle peut prêter durant une certaine durée en échange d'une caution. Ces équipements comprennent:
                <ul>
                    <li>Des bornes d'appoint en cas de défaillance ou faiblesse <b>avérée et répétée</b> de la connexion.</li>
                </ul>
            </p>
        </div>
        <div>
            <h2>Équipe</h2>
            Le bureau est constitué de :
            <ul>
                <li>Grégoire Girardet, président ;</li>
                <li>Adrien Martinez, trésorier ;</li>
                <li>Mathis Liens, secrétaire général.</li>
            </ul>
        </div>
    </div>
}
