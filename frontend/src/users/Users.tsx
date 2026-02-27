import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuthService } from "../services/auth.service"
import usePopupService from "../services/popup.service";
import UserBoard from "./UserBoard";
import UserRegister from "./UserRegister";
import UserVerifyEmail from "./UserVerifyEmail";
import UserNewPassword from "./PasseOublie";
import DisplayID from "./IdDisplay";

const pathBaseUsers = "/resident/login"

function ProtectedRoute(props : any) {

    const authService = useAuthService();
    const popupService = usePopupService();
    const navigate = useNavigate();
  
    const connected = authService.user.uid !== undefined;

    if (!connected) {
        authService.loginFromIDAndToken()
        .then(() => {
            console.log("Redirection...")
            navigate(props.path, {replace : true});
        })
        .catch((error) => {
            //TODO : quelque chose si pas connecté
            const errorStatus = error.response.status;
            switch(errorStatus) {
                case 400 : break   // This status code means no token was sent, we don't need to inform the user
                case 401 : {
                    popupService.changePopup({status : "error", message : "Veuillez vous reconnecter"});
                    break;
                }
                case 500 : {
                    popupService.changePopup({status: "error", message : "Erreur serveur, veuillez réessayer ou nous contacter par mail"});
                    break;
                }
            }
        })
    }
    
    return connected ? props.child : <Navigate to={pathBaseUsers} replace/>
}

export default function Users() {

    const authService = useAuthService();

    return <Routes>
        <Route path="login" element={<authService.LoginFormComponent redirectionPathIfSuccess="/resident/board" title="Connexion résident" displayAccountCreationLink={true}/>}/>
        <Route path="board" element={<ProtectedRoute path="/resident/board" child={<UserBoard/>}/>}/>
        <Route path="register" element={<UserRegister/>}/>
        <Route path="verify-email/:idString/:verificationCode" element={<UserVerifyEmail/>}/>
        <Route path="new-password" element={<UserNewPassword/>}/>
        <Route path="get-password/:token" element={<DisplayID/>}/>

        <Route
            path="*"
            element={<Navigate to="/resident/board" replace />}
        />
    </Routes>

}