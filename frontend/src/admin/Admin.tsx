import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthService } from '../services/auth.service';
import usePopupService from '../services/popup.service';
import ListRadiusUsers from './admin-features/ListRadiusUsers/ListRadiusUsers';
import UserCreation from './admin-features/UserCreation';
import UsersManager from './admin-features/UsersManager';
import AdminBoard from './AdminBoard';
import { useEffect } from 'react';

const adminBasePath = "/admin/login";


function ProtectedRoute(props : any) {
    console.log("Render protected route")

    const authService = useAuthService();
    const popupService = usePopupService();
    const navigate = useNavigate();

    const connected = authService.user.uid !== undefined;
    const admin = authService.user.is_admin;


    useEffect( () => {
        if (!connected) {
            authService.loginFromIDAndToken()
            .then((isAdmin : boolean) => {
                if (isAdmin) {
                    navigate(props.path, {replace : true});
                }
            })
            .catch((error) => {
                if(error.message === "Pas d'ID utilisateur stocké localement"){
                    return;
                }
                const errorStatus = error.response.status;
                switch(errorStatus) {
                    case 400 : break   // This status code means no token was sent, we don't need to inform the user
                    case 401 : {
                        popupService.changePopup({status : "error", message : "Le cookie d'authentification a expiré, connexion automatique impossible"});
                        break;
                    }
                }
            })
        } else {
            if (!admin) {
                popupService.changePopup({status : "error", message : "Accès interdit"});
                console.log("go back to home, you should't be there !");
            }
        }
    }, [authService.user])
    return admin ? props.child : <Navigate to={adminBasePath} replace/>
}

export default function Admin(){

    const authService = useAuthService();
    const navigate = useNavigate();

    const featuresDefinition = [ // Name, description & component to display
        {
            name : "Gestion des comptes", 
            description : "Pour gérer les comptes présents sur la base de données",
            routeName : "gestion",
            component : UsersManager
        },
        {
            name : "Créer des comptes", 
            description : "Pour créer des comptes à partir d'Excel avec les cotisations déjà enregistrées",
            routeName : "creation",
            component : UserCreation
        },
        {
            name : "Voir les comptes inscrits sur le radius", 
            description : "Pour avoir la liste des comptes inscrits en temps réel sur le radius",
            routeName : "list-radius",
            component : ListRadiusUsers
        },
    ]

    const featureComponent = (feature : any) => {
        return (<>
            <h4 className="retour-board-admin" onClick={() => {navigate("/admin/board", {replace : true})}}> Retour </h4>
            <h2 className="titre-page-admin"> {feature.name} </h2>
            <div className="feature-view">
                <feature.component />
            </div>
        </>)
    }

    const FeaturesRoutes = featuresDefinition.map(
        feature => <Route key={feature.name + " route"} path={feature.routeName} element={<ProtectedRoute path={"/admin/" + feature.routeName} child={featureComponent(feature)}/>}/>
    )

    return <Routes>
        <Route path="login" element={<authService.LoginFormComponent redirectionPathIfSuccess="/admin/board" title="Connexion administrateur" displayAccountCreationLink={false}/>}></Route>
        <Route path="board" element={<ProtectedRoute path="/admin/board" child={<AdminBoard featuresDefinition={featuresDefinition}/>}/> }/>
            
        {FeaturesRoutes}
        <Route
            path=""
            element={<Navigate to="/admin/board" replace />}
        />
    </Routes>
}