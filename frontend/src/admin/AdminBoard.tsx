import { Link } from "react-router-dom";
import AccountsSyntesis from "./AccountsSyntesis";
import { FeatureDefinition } from "./Admin";
import "./Admin.scss";

export default function AdminBoard(props: any) {
    return (
        <div className="admin-board-layout">
            <main className="admin-main-content">
                <section id="features">
                    <h2>Fonctionnalités</h2>
                    <div className="admin-features-grid">
                        {props?.featuresDefinition.map((feature: FeatureDefinition) => (
                            <Link
                                key={feature.name + " lien"}
                                to={"/admin/" + feature.routeName}
                                className="feature-card-link"
                            >
                                <div className="admin-feature-card">
                                    <h3 className="feature-title">{feature.name}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section id="synthesis">
                    <h2>Synthèse des comptes</h2>
                    <div className="feature-view">
                        <AccountsSyntesis />
                    </div>
                </section>

                <section id="links">
                    <h2>Liens utiles</h2>
                    <ul className="useful-links-list">
                        <li>
                            <span>Zeus (routeur pfSense principal)</span>
                            <a href="https://10.100.0.251:1337" target="_blank" rel="noreferrer">
                                https://10.100.0.251:1337
                            </a>
                        </li>
                        <li>
                            <span>Hades (routeur pfSense de secours)</span>
                            <a href="https://10.100.0.252:1337" target="_blank" rel="noreferrer">
                                https://10.100.0.252:1337
                            </a>
                        </li>
                        <li>
                            <span>PVE (nouveau serveur)</span>
                            <a href="https://10.100.1.56:8006" target="_blank" rel="noreferrer">
                                https://10.100.1.56:8006
                            </a>
                        </li>
                        <li>
                            <span>PVE2 (ancien serveur)</span>
                            <a href="https://10.100.1.57:8006" target="_blank" rel="noreferrer">
                                https://10.100.1.57:8006
                            </a>
                        </li>
                        <li>
                            <span>Nuclias (gestion des bornes)</span>
                            <a href="https://10.100.1.74:30001" target="_blank" rel="noreferrer">
                                https://10.100.1.74:30001
                            </a>
                        </li>
                        <li>
                            <span>Grafana (monitoring)</span>
                            <a href="https://clio.rezal-mdm.com/grafana" target="_blank" rel="noreferrer">
                                https://clio.rezal-mdm.com/grafana
                            </a>
                        </li>
                        <li>
                            <span>Documentation Administrateur</span>
                            <a href="http://gitlab.rezal-mdm.com/root/administrator" target="_blank" rel="noreferrer">
                                GitLab Administrator
                            </a>
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
