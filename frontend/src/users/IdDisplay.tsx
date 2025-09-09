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
            { infos.user } : { infos.mdp }
        </div>
    </>
}

