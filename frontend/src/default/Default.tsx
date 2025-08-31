
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import './Default.scss';
import arrivee from "../assets/img/arrivee.jpg";
import baieServeur from "../assets/img/baie_serveur.png";
import discussion from "../assets/img/discussion.jpg"
import useWindowService from '../services/window.service';

export function Default() {

    const windowService = useWindowService();
    const windowWidth = windowService.windowDimensions.width;

    return (<>
        <h1 id="titre-page-default"> Bienvenue sur le site du Rézal </h1>
        <p id="border-line"></p>
        <div className="bande">
            {windowWidth > 767 && <img src={arrivee} alt="arrivant" className="image"/>}
            <div className="container-description">
                <h1> Tu viens d'arriver ? </h1>
                <p> Pour avoir accès à internet tu dois te créer un compte qui sera ensuite accepté par le Rezal
                    La cotisation est de 5€ par trimestre, tu peux payer en chambre ou dans la boite aux lettres 420 </p>
                <Link to="resident/register"><Button className="btn-navigation" variant="outlined" color="success"> Je crée mon compte  </Button></Link>
            </div>
        </div>

        <div className="bande">
            <div className="container-description">
                <h1> Tu as déjà un compte ? </h1>
                <p> Accède à ton compte pour vérifier ou modifier tes informations personnelles </p>
                <Link to="resident/login"><Button className="btn-navigation" variant="outlined" color="success"> Je me connecte  </Button></Link>
            </div>
            {windowWidth > 767 && <img src={baieServeur} alt="baie-serveur" className="image"/>}
        </div>

        <div className="bande">
            {windowWidth > 767 && <img src={discussion} alt="discussion" className="image"/>}
            <div className="container-description">
            <h1> Tu veux plus nous connaitre ? </h1>
                <p> Pour avoir plus d'informations sur le Rézal, comment cotiser, se connecter et même nous contacter ! </p>
                <Link to="/about-us"><Button className="btn-navigation" variant="outlined" color="success"> Je découvre  </Button></Link>
            </div>
        </div>
    </>)
    
}