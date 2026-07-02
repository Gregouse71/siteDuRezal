import { Link } from "react-router-dom";
import "./Default.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faCodeBranch,
    faGamepad,
    faBrush,
    faTicket,
    faMasksTheater,
    faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";
import logoRezal from "../assets/img/logo rezal.png";
import logoFederez from "../assets/img/federez.png";
import mdmImg from "../assets/img/mdm.jpg";

const Default = () => {
    const elements = [
        {
            icon: faUsers,
            title: (
                <a
                    href="https://eleves.rezal-mdm.com/public"
                    target="_blank"
                    rel="noreferrer"
                    className="service-card-link"
                >
                    Portail des élèves
                </a>
            ),
            content: <>Toutes les infos sur les élèves, les assos, et les événements de l'école.</>,
        },
        {
            icon: faCodeBranch,
            title: (
                <a href="https://gitlab.rezal-mdm.com" target="_blank" rel="noreferrer" className="service-card-link">
                    Instance GitLab
                </a>
            ),
            content: <>Pour héberger tous les projets et collaborer avec git.</>,
        },
        {
            icon: faMasksTheater,
            title: (
                <a href="https://bda.rezal-mdm.com" target="_blank" rel="noreferrer" className="service-card-link">
                    Site web du BDA
                </a>
            ),
            content: (
                <>
                    Pour PAPSer les places pour tous les événements. Retrouvez aussi tous les livres de la{" "}
                    <a href="https://bibliotheque-bda.rezal-mdm.com" target="_blank" rel="noreferrer">
                        bibliothèque du BDA
                    </a>
                    .
                </>
            ),
        },
        {
            icon: faNetworkWired,
            title: (
                <a href="https://www.rezal-mdm.com/" target="_blank" rel="noreferrer" className="service-card-link">
                    Portail du Rézal
                </a>
            ),
            content: <>Pour gérer ton compte associatif Rézal, ton accès au réseau et tes cotisations.</>,
        },
        {
            icon: faBrush,
            title: (
                <a
                    href="https://mail-colorer.rezal-mdm.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="service-card-link"
                >
                    Colorieur de mails du BDA
                </a>
            ),
            content: <>Pour créer plus facilement des mails de toutes les couleurs.</>,
        },
        {
            icon: faTicket,
            title: (
                <a href="https://www.partycrasher.fr/" target="_blank" rel="noreferrer" className="service-card-link">
                    Partycrasher
                </a>
            ),
            content: <>Pour revendre les billets de soirées dont vous ne voulez plus.</>,
        },
        {
            icon: faGamepad,
            title: <>Serveur de jeu de Proga'min</>,
            content: <>Pour jouer à Minecraft, Factorio et autres jeux en LAN et à distance.</>,
        },
    ];

    return (
        <div className="home-wrapper">
            <div className="main-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 main-content">
                            <h1 className="main-title">Bienvenue au Rézal</h1>
                            <p className="main-subtitle">
                                Le Rézal est l'association chargée de l'exploitation du réseau informatique de la{" "}
                                <i>
                                    <a
                                        style={{ textDecoration: "inherit", color: "inherit" }}
                                        href="https://www.maisondesmines.com/"
                                    >
                                        Maison des Mines et des Ponts
                                    </a>
                                </i>
                                .
                            </p>
                            <div className="main-buttons">
                                <Link to="resident/register" className="btn btn-success btn-lg">
                                    Inscription
                                </Link>
                                <Link to="/resident" className="btn btn-primary btn-lg">
                                    Mon compte
                                </Link>
                                <Link to="/about-us" className="btn btn-primary btn-lg">
                                    Plus d'information
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1 main-image-container">
                            <img src={logoRezal} alt="Logo Rézal" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="services-wrapper">
                <div className="services-section">
                    <div className="container">
                        <h2 className="section-title">Le réseau</h2>
                        <div className="section-subtitle">
                            Le but premier de l'association est de fournir un accès internet à ses adhérents résidents
                            de la Maison des Mines et des Ponts, par WiFi et en filaire, pour 5€ par trimestre. Tous nos
                            services sont hébergés dans les locaux de la résidence, nous utilisons des logiciels libres,
                            et nous ne collectons que les données requises pour le fonctionnement des services et pour
                            notre conformité réglementaire.
                            <div className="network-visuals">
                                <div className="map-container">
                                    <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=2.3207330703735356%2C48.831334126213896%2C2.360901832580567%2C48.85248907447689&amp;layer=mapnik&amp;marker=48.8419041%2C2.3407878"></iframe>
                                </div>
                                <div className="mdm-image-container">
                                    <img src={mdmImg} alt="Maison des Mines" className="img-fluid mdm-img" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="services-section">
                    <div className="container">
                        <h2 className="section-title">Les Services</h2>
                        <div className="section-subtitle">
                            Le Rézal héberge différents services et projets des élèves de l'École des Mines dans le but
                            de promouvoir l'indépendance des activités des élèves. Ces services sont hébergés sur nos
                            propres serveurs, ne collectent pas de données personnelles et ne participent pas au
                            financement d'activité nuisibles.
                        </div>

                        <div className="row g-4 justify-content-center mt-2">
                            {elements.map(({ icon, title, content }, i) => (
                                <>
                                    <div className="col-md-6 col-lg-3" key={i}>
                                        <div className="feature-card h-100">
                                            <div className="card-icon">
                                                <FontAwesomeIcon icon={icon} size="3x" />
                                            </div>
                                            <h4 className="card-title">{title}</h4>
                                            <p className="card-text">{content}</p>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="services-section">
                    <div className="container">
                        <h2 className="section-title">FedeRez</h2>
                        <div className="section-subtitle">
                            Le Rézal fait partie de la fédération d'association étudiantes d'informatique Federez.
                        </div>
                        <a href="https://federez.net">
                            <img src={logoFederez} alt="Logo Rézal" className="img-fluid" style={{ height: "100px" }} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Default;
