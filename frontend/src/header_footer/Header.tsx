import { NavLink, Link } from 'react-router-dom';
import { useAuthService } from '../services/auth.service';
import './Header.scss'
import logoRezal from "../assets/img/logo rezal.png";

export function Header() {
    
    const authService = useAuthService();

    return (
        <nav id="header">
            <div id="container-header">
                <div className="item logo">
                    <Link to="/"><img src={logoRezal} alt="Logo Rézal" /></Link>
                </div>
                <div className="item">
                    <NavLink to="/" end>Accueil</NavLink>
                </div>
                <div className="item">
                    <NavLink to="/about-us">Infos</NavLink>
                </div>
                <div className="item">
                    <NavLink to="/faq">Besoin d'aide ?</NavLink>
                </div>
                <div className="item">
                    <NavLink to="/resident">Résident</NavLink>
                </div>
                <div className="item">
                    <NavLink to="/admin">Administrateur</NavLink>
                </div>
                {authService.user.id !== undefined && (
                    <div className="item">
                        <Link to="/" onClick={authService.logout}>Déconnexion</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
