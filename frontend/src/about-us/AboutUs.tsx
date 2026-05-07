import "./AboutUs.scss"
import { BACKEND_BASE_URL } from "../base_url.js"
import { Link } from "react-router-dom"

export function AboutUs() {
    return (
        <div className="about-us-layout">
            <nav className="toc-sidebar">
                <div className="toc-sticky">
                    <ul>
                        <li><a href="#association">Le Rézal</a></li>
                        <li><a href="#connexion">Connexion</a></li>
                        <li><a href="#cotisation">Cotisation</a></li>
                        <li><a href="#materiel">Préts</a></li>
                        <li><a href="#bureau">Le Bureau</a></li>
                    </ul>
                </div>
            </nav>

            <main className="about-us-content">
                <div id="association">
                    <h2>Le Rézal</h2>
                    <p>Le Rézal est l'association à but non lucratif chargée de l'exploitation du réseau informatique de la Maison des Mines et des Ponts. Elle est gérée par des étudiants de l'École des Mines de Paris. Pour toute question ou problème technique, envoyez un mail à <a href="mailto:admin@rezal-mdm.com">admin@rezal-mdm.com</a>. Nous nous efforcerons de répondre dans les meilleurs délais.</p>
                </div>

                <div id="connexion">
                    <h2>Connexion</h2>
                    <p>Il est nécessaire de disposer d'un compte Rézal pour se connecter au réseau, et d'être cotisant pour le trimestre. Pour vous créer un compte, rendez-vous <Link to="/resident/register">ici</Link>.</p>
                    <p>Pour la connexion en filaire, seules certaines prises RJ45 se trouvant dans les chambres sont fonctionnelles. Elles sont généralement marquées <i>Info</i> ou <i>PC</i>, les autres étant souvent marquées <i>PTT</i>.</p>
                    <p>Pour la WiFi, le réseau principal est nommé <b>Rezal</b>. En cas de connexion instable, utilisez <b>Rezal-2.4GHz</b>.</p>

                    <div className="connection-methods">
                        <div className="method-item">
                            <h3>Windows</h3>
                            <p>Sélectionnez le réseau, entrez vos identifiants Rézal et validez. En cas d'alerte de sécurité, ignorez la lors de la première connexion et validez.</p>
                        </div>

                        <div className="method-item">
                            <h3>Apple (Mac, iPhone, iPad)</h3>
                            <p>L'installation d'un profil de configuration est nécessaire :</p>
                            <ol>
                                <li>Téléchargez le <a href={`${BACKEND_BASE_URL}/apple_profile`}>profil Rézal</a>.</li>
                                <li><b>Sur Mac</b> : Allez dans <i>Réglages Système &gt; Profils</i> et procédez à l'installation du profil Rézal.</li>
                                <li><b>Sur iPhone/iPad</b> : Allez dans <i>Réglages &gt; Profil téléchargé</i>, sélectionnez le profil et procédez à l'installation du profil Rézal.</li>
                            </ol>
                        </div>

                        <div className="method-item">
                            <h3>Android / Linux / Chromebook</h3>
                            <p>Utilisez les paramètres suivants :</p>
                            <table className="config-table">
                                <tbody>
                                    <tr>
                                        <td>Sécurité</td>
                                        <td>WPA2 Entreprise</td>
                                    </tr>
                                    <tr>
                                        <td>Méthode EAP</td>
                                        <td>TTLS</td>
                                    </tr>
                                    <tr>
                                        <td>Phase 2 / Authentification interne</td>
                                        <td>PAP</td>
                                    </tr>
                                    <tr>
                                        <td>Certificat CA</td>
                                        <td>Faire confiance à la 1ère connexion (ou Faire confiance au domaine : radius.rezal-mdm.com)</td>
                                    </tr>
                                    <tr>
                                        <td>Identité et Mot de passe</td>
                                        <td>Vos identifiants Rézal</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div id="cotisation">
                    <h2>Cotisation</h2>
                    <div className="reflexe-box">
                        <strong>Cotiser maintenant :</strong> Rendez-vous sur <a href="https://www.helloasso.com/associations/rezal/adhesions/cotisations-rezal-25-26" target="_blank" rel="noopener noreferrer">HelloAsso</a>, et cotisez avec la <b>même adresse mail</b> qu'utilisée pour créer votre compte.
                    </div>
                    <p>La cotisation est de <b>5€ par trimestre</b>. Elle permet de financer les abonnements fibre et l'entretien du matériel réseau. Une fois que vous avez cotisé pour un trimestre sur HelloAsso, vous pouvez activer votre accès à internet pour ce trimestre sur votre page <Link to="/resident/board">résident</Link>.</p>
                    <h3>Calendrier 2025-2026</h3>
                    <ul>
                        <li><b>Trimestre 1</b> : 10 septembre - 30 novembre</li>
                        <li><b>Trimestre 2</b> : 17 novembre - 22 février</li>
                        <li><b>Trimestre 3</b> : 16 février - 15 juillet</li>
                    </ul>
                    <p>N'oubliez pas d'activer vos crédits dans l'onglet <b>Résident</b> pour activer votre accès une fois que vous avez payé.</p>
                </div>

                <div id="materiel">
                    <h2>Prêts</h2>
                    <p>En cas de mauvaise couverture WiFi dans votre chambre, nous pouvons vous prêter une borne à placer dans votre chambre.</p>
                </div>

                <div id="bureau">
                    <h2>Le Bureau</h2>
                    <p>Le bureau de l'association est constitué de :</p>
                    <ul>
                        <li><b>Grégoire Girardet</b> : Président</li>
                        <li><b>Adrien Martinez</b> : Trésorier</li>
                        <li><b>Mathis Liens</b> : Secrétaire Général</li>
                    </ul>
                    <p>Vous pouvez nous contacter directement en cas de besoin.</p>
                    <p>La passaction a lieu à la fin du premier semestre. Peuvent se présenter au bureau tous les élève sde l'École des Mines de Paris, de l'École des Ponts et Chaussées et de l'ENSTA.</p>
                </div>
            </main>
        </div>
    )
}
