import "./AboutUs.scss"

import charte from "../assets/doc/Charte_VF.pdf";
import statut from "../assets/doc/status.pdf";
import { BACKEND_BASE_URL } from "../base_url.js"

export function AboutUs() {
    return <div id="container-about-us" style={{ textAlign: "left" }}>
        <div>
            <h2>Le Rézal</h2>
            <p>Le Rézal est l'association chargée de l'exploitation du réseau informatique de la Maison des Mines et des Ponts, par délégation de la direction.</p>
        </div>
        <div>
            <h2>Se connecter au réseau</h2>
            <p>
                Le nom du réseau principal pour les cotisants est <b>Rezal</b>. Si la connexion est mauvaise dans votre chambre, vous pouvez aussi essayer <b>Rezal-2.4GHz</b>.
            </p>
            <ul>
                <li>Pour windows : cliquer sur Rezal, rentrez vos identifiants, et confirmez que vous vous attendez à voir Rezal à cet endroit.</li>
                <li>Pour les Mac : téléchargez <a style={{ color: "blue", fontSize: "1em" }} href={`${BACKEND_BASE_URL}/apple_profile`}>ce profil</a>, allez dans <em>Réglages système</em>, cherchez <em>Profils</em>, double-cliquez sur le profil nommé Rézal, et sélectionnez <em>Installer</em>.</li>
                <li>Pour les iPhones : téléchargez <a style={{ color: "blue", fontSize: "1em" }} href={`${BACKEND_BASE_URL}/apple_profile`}>ce profil</a> allez dans <em>Réglages</em>, <em>Profil téléchargé</em>, rentrez le code de votre téléphone, puis vos identifiants du Rézal.</li>
                <li>Pour les appareils Android : lors de la connexion, il faut sélectionner TTLS en <em>Méthode EAP</em>, PAP en <em>Application étape 2</em>, et Faire confiance lors de la première connexion comme <em>Certificat CA</em>. Remplissez vos identifiants Rézal dans <em>Identité</em> et <em>Mot de passe</em>. Si vous ne pouvez pas Faire confiance à la première connexion, sélectionnez <em>Certificats du système</em> et choisisez de faire confiance au domaine <em>rezal-mdm.com</em></li>
            </ul>
            
        </div>
        <div>
            <h2>Cotisation</h2>
            La campagne de cotisation est accessible <a
                style={{ color: "blue", marginLeft: "3px" }}
                href="https://www.helloasso.com/associations/rezal/adhesions/cotisations-rezal-25-26"
            >ici</a>, sur HelloAsso.
            <h3>Pourquoi une cotisation ?</h3>
            <p>
                La cotisation est nécessaire pour que l'association puisse payer les frais des abonnements WiFi, renouveler ses équipements, et constituer un fonds de secours en cas de défaillance soudaine d'équipements essentiels.<br />
                Actuellement, la cotisation se fait sur une durée <b>trimestrielle: 5€/trimestre</b> , selon le découpage suivant :
            </p>
            <p>
                <ul>
                    <li>Trimestre 1 : 10 septembre - 30 novembre</li>
                    <li>Trimestre 2 : 17 novembre - 22 février </li>
                    <li>Trimestre 3 : 16 février - 15 juillet</li>
                </ul>
            </p>
            <h3>Comment cotiser ?</h3>
            <p>
                La cotisation se fait par paiement via HelloAsso, ou par chèque ou par espèces, directement dans une chambre ou dans une boite aux lettres d'un membre du bureau restreint.
                Une fois que vous avez cotisé, vous voyez dans votre onglet <b>Résident</b> un nombre de crédits correspondant au nombre de trimestres pour lesquels vous avez cotisé. C'est ensuite à vous de jouer : activez avec ces crédits votre accès au Rézal pour les trimestres pendant lesquels vous voulez avoir accès à cette connexion WiFi de qua-li-té ! Et le tour est joué !
            </p>
        </div>
        <div>
            <h2>Prêt d'équipements</h2>
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
