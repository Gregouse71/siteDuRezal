import { Link } from 'react-router-dom';
import './Default.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCodeBranch, faTicketAlt, faGamepad, faGlobe, faBook } from '@fortawesome/free-solid-svg-icons';
import logoRezal from "../assets/img/logo rezal.png";
import logoFederez from "../assets/img/federez.png"

export function Default() {
    return (
        <div className="home-wrapper">
            <div className="main-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 main-content">
                            <h1 className="main-title">Bienvenue au Rézal</h1>
                            <p className="main-subtitle">
                                Le Rézal est l'association chargée de l'exploitation du réseau informatique de la Maison des Mines et des Ponts.
                            </p>
                            <div className="main-buttons">
                                <Link to="resident/register" className="btn btn-success btn-lg">Inscription</Link>
                                <Link to="/resident" className="btn btn-primary btn-lg">Mon compte</Link>
                                <Link to="/about-us" className="btn btn-primary btn-lg">Plus d'information</Link>
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
                        <div className="section-subtitle">Le but premier de l'association est de fournir un accès internet à ses adhérents résidents de la Maison des Mines et des Ponts, par WiFi et en filaire, pour 5€ par trimestre. Nous proposons aussi un accès à des services web.</div>
                    </div>
                </div>

                <div className="services-section">
                    <div className="container">
                        <h2 className="section-title">Les Services</h2>
                        <div className="section-subtitle">Le Rézal héberge différents services et projets des élèves de l'École des Mines.</div>

                        <div className="row g-4 justify-content-center mt-2">
                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card h-100">
                                    <div className="card-icon">
                                        <FontAwesomeIcon icon={faUsers} size="3x" />
                                    </div>
                                    <h4 className="card-title"><a href="https://eleves.rezal-mdm.com/public" target="_blank" rel="noreferrer" className="service-card-link">Portail des élèves</a></h4>
                                    <p className="card-text">Toutes les infos sur les élèves, les assos, et les événements de l'école.</p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card h-100">
                                    <div className="card-icon">
                                        <FontAwesomeIcon icon={faCodeBranch} size="3x" />
                                    </div>
                                    <h4 className="card-title"><a href="https://gitlab.rezal-mdm.com" target="_blank" rel="noreferrer" className="service-card-link">Instance GitLab</a></h4>
                                    <p className="card-text">Pour héberger tous les projets et collaborer avec git.</p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card h-100">
                                    <div className="card-icon">
                                        <FontAwesomeIcon icon={faTicketAlt} size="3x" />
                                    </div>
                                    <h4 className="card-title"><a href="https://bda.rezal-mdm.com" target="_blank" rel="noreferrer" className="service-card-link">Site web du BDA</a></h4>
                                    <p className="card-text">
                                        Pour PAPSer les places pour tous les événements. Retroubez aussi tous les livres de la <a href="https://bibliotheque-bda.rezal-mdm.com" target="_blank" rel="noreferrer">bibliothèque du BDA</a>.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card h-100">
                                    <div className="card-icon">
                                        <FontAwesomeIcon icon={faGamepad} size="3x" />
                                    </div>
                                    <h4 className="card-title">Serveur de jeu de Proga'min</h4>
                                    <p className="card-text">Pour jouer à Minecraft, Factorio et autres jeux en LAN et à distance.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="services-section">
                    <div className="container">
                        <h2 className="section-title">FedeRez</h2>
                        <div className="section-subtitle">Le Rézal fait partie de la fédération d'association étudiantes d'informatique Federez.</div>
                        <a href="https://federez.net"><img src={logoFederez} alt="Logo Rézal" className="img-fluid" style={{ height: "100px" }} /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}
