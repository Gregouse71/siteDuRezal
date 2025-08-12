
import { Routes, Route, Link } from 'react-router-dom';
import "./AboutUs.scss"
import Connexion from './pages/Connexion';
import Contact from './pages/Contact';
import Cotisations from './pages/Cotisations';
import Equipe from './pages/Equipe';
import Equipement from './pages/Equipement';
import Recrutement from './pages/Recrutement';

export function AboutUs() {

    return <div id="container-about-us">
        <div id="navbar-about-us">
            <Link className="itemAboutUs" to="connexion" color="inherit">
                <span className="description"> Connexion </span>
                <span className="fa fa-sign-in icon"></span> 
            </Link>
            <Link className="itemAboutUs" to="contact" color="inherit">
                <span className="description"> Contact </span>
                <span className="fa fa-address-book icon"></span> 
            </Link>
            <Link className="itemAboutUs" to="cotisation" color="inherit">
                <span className="description"> Cotisation </span>
                <span className="fa fa-euro icon"></span> 
            </Link>
            <Link className="itemAboutUs" to="equipe" color="inherit">
                <span className="description"> Equipe </span>
                <span className="fa fa-user icon"></span> 
            </Link>
            <Link className="itemAboutUs" to="equipements" color="inherit">
                <span className="description"> Prêts </span>
                <span className="fa fa-cogs icon"></span> 
            </Link>
            <Link className="itemAboutUs" to="recrutement" color="inherit">
                <span className="description"> Recrutement </span>
                <span className="fa fa-users icon"></span> 
            </Link>
        </div>
        <Routes>
            <Route path="connexion" element={<Connexion/>}></Route>
            <Route path="contact" element={<Contact/>}></Route>
            <Route path="cotisation" element={<Cotisations/>}></Route>
            <Route path="equipe" element={<Equipe/>}></Route>
            <Route path="equipements" element={<Equipement/>}></Route>
            <Route path="recrutement" element={<Recrutement/>}></Route>
        </Routes>
    </div>
}