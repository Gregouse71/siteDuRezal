import { Link } from "react-router-dom";
import AccountsSyntesis from "./AccountsSyntesis";
import { type FeatureDefinition } from "./Admin";
import "./Admin.scss";
import httpInstance from "../services/api";
import usePopupService from "../services/popup.service";
import { databaseAccountsState, useAdminService } from "../services/admin.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";
import useConversionService from "../services/conversion.service";
import { AccountXLSX } from "../models/accountXLSX";
import useCSVService from "../services/csv.service";

export default function AdminBoard(props: any) {
    return (
        <div className="admin-board-layout">
            <main className="admin-main-content">
                <section id="features">
                    <h2>Gestion</h2>
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

                <section id="features">
                    <h2>Fonctionnalités</h2>
                    <div className="admin-features-grid">
                        <DownloadAccounts />
                        <ClearAllData />
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

function DownloadAccounts() {
    const { AccountToXLSXAccount } = useConversionService();
    const { exportAsCSV } = useCSVService();

    const databaseAccounts = useRecoilValue(databaseAccountsState);

    const uploadCSVUsers = () => {
        const CSVExport: AccountXLSX[] = Array.from(databaseAccounts).map((accountIDAndAccountData) =>
            AccountToXLSXAccount(accountIDAndAccountData[1]),
        );

        exportAsCSV(CSVExport, "comptes rezal");
    };

    return (
        <div
            className="admin-feature-card btn btn-outline-success btn-lg"
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
            }}
            onClick={() => uploadCSVUsers()}
        >
            <h3 className="feature-title">Télécharger l'état des comptes</h3>

            <FontAwesomeIcon icon={faFileExcel} size="2x" style={{ margin: "0 0 0 1rem" }} />
            <FontAwesomeIcon icon={faDownload} size="2x" style={{ margin: "0 0 0 1rem" }} />
        </div>
    );
}

function ClearAllData() {
    const popupService = usePopupService();
    const { updateDatabaseView } = useAdminService();

    const actionOnClick = () => {
        if (window.confirm("Tu es sûr ? Tu vas supprimer toutes les données de cotisation !")) {
            httpInstance.get("api/list/clearall").then((response) => {
                switch (response.data) {
                    case "Success":
                        popupService.changePopup({
                            status: "success",
                            message: "Opération réussie.",
                        });
                        break;
                    default:
                        popupService.changePopup({
                            status: "error",
                            message: "Echec.",
                        });
                        break;
                }
                updateDatabaseView();
            });
        }
    };

    return (
        <div className="admin-feature-card btn btn-outline-primary btn-lg" onClick={actionOnClick}>
            <h3 className="feature-title"> Effacer les données de cotisation </h3>
            <p className="feature-description">
                Pour passer à l'année suivante.
                <br />
                <span style={{ color: "red" }}>Sauvegardez l'état des comptes avant !</span>
            </p>
        </div>
    );
}
