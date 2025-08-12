import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAccountService from "../services/account.service";
import usePopupService from "../services/popup.service";


export default function UserVerifyEmail() {

    let { idString, verificationCode } = useParams();
    const accountService = useAccountService();
    const navigate = useNavigate();
    const popupService = usePopupService();

    useEffect(() => {
        emailVerification();
    }, []);

    const emailVerification = () => {
        try {
            const id = parseInt(idString || "");
            accountService.emailVerification({
                userId : id,
                secretValue : verificationCode
            })
            .then(() => {
                popupService.changePopup({status :  "success", message : "Verification de l'email réussie, redirection vers la connexion... "});
                navigate('/resident/login');
            })
            .catch(error => {
                const errorStatus = error.request.status;
                switch(errorStatus) {
                    default : popupService.changePopup({status :  "error", message : "Erreur inconnue"});
                }
            })
        }
        catch {
            popupService.changePopup({status :  "error", message : "Informations de vérifications non reconnues dans le chemin d'accès rentré"});
        }

        
    } 

    return <>
        La



        
    </>
}