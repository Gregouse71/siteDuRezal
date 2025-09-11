import { FormControl, FormLabel, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAccountService from "../services/account.service";
import usePopupService from "../services/popup.service";

export default function DisplayID() {
    let { token } = useParams();

    const accountService = useAccountService();
    const popupService = usePopupService();

    const [infos, setInfos] = useState({ user: "", mdp: ""});

    const getPassword = () => {
        accountService.getNewPassword({ token: token })
            .then((response: any) => {
                popupService.changePopup({ status: "success", message: "Identifiants récupérés" })
                console.log (response);
                setInfos(response.data);
            })
            .catch(error => {
                const errorStatus = error.response.status;
                switch (errorStatus) {
                    case "400": {
                        popupService.changePopup({ status: "error", message: "Impossible d'obtenir les identifiants" });
                        break;
                    }
                    case "401": {
                        popupService.changePopup({ status: "error", message: "Le code d'identification a expiré. Contactez l'administrateur." });
                        break;
                    }
                    default: popupService.changePopup({ status: "error", message: "Erreur inconnue" })
                }
            });
    }

    useEffect( () => {
        getPassword();
    }, [])

    return <>
        <h2> Vos identifiants </h2>
        <div>
            <ul>Ton identifiant est : { infos.user }</ul>
            <ul>Ton mot de passe est : { infos.mdp }</ul>
        </div>
        <div>Prends le soin de les noter quelque part. <strong>Tu n'y aura plus accès une fois que tu auras quitté cette page.</strong></div>
    </>
}

