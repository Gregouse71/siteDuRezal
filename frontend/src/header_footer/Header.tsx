import { Link } from 'react-router-dom';
import { useAuthService } from '../services/auth.service';
import './Header.scss'

export function Header() {
    
    const authService = useAuthService();

    return <div id="header">
        
        <div id="container-header">
            <p className = "item">
                <Link to="/" color="inherit"> Accueil</Link>
            
            </p>
            <p className = "item">
                <Link to="/about-us" color="inherit"> Infos</Link>
            </p>
            <p className = "item">
                <Link to="/resident" color="inherit"> Résident</Link>
            </p>
            <p className = "item">
                <Link to="/admin" color="inherit"> Administrateur</Link>
            </p>
            {authService.user.id !== undefined && <>
                <p className = "item">
                    <Link to="/" color="inherit" onClick={authService.logout}> Deconnexion</Link>
                </p>
            </>}
        </div>
    
    </div>
    
    
    
}