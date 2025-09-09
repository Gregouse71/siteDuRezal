import { FormControl, FormLabel, TextField, Button } from "@mui/material";
import { useState } from "react";
import useAccountService from "../services/account.service";
import usePopupService from "../services/popup.service";

export default function UserNewPassword() {
    const accountService = useAccountService();
    const popupService = usePopupService();

    const [email, setEmail] = useState("");
    const [postAsk, setPostAsk] = useState(false);

    const isEmailCorrect = () => email !== "";

    const handleInputChange = (e: any) => {
        const { value } = e.target;
        console.log (value);
        setEmail( value );
    };

    const sendMail = () => {
        setPostAsk(true);
        accountService.getNewPassword({ email: email })
            .then((response: any) => {
                popupService.changePopup({ status: "success", message: "Mail envoyé" })
                setPostAsk(true);
            })
            .catch(error => {
                const errorStatus = error.response.status;
                switch (errorStatus) {
                    case "400": {
                        popupService.changePopup({ status: "error", message: "Cet adresse mail n'est pas enregistrée" });
                        break;
                    }
                    default: popupService.changePopup({ status: "error", message: "Erreur inconnue" })
                }
            });
    }

    return <>
        <h2> Demande de nouveau mot de passe </h2>
        <div>
            <FormControl id="register-form" style={{ fontSize: "0.7rem" }}>
                <FormLabel style={{ fontSize: "2em", margin: "2vh 0" }}>Email</FormLabel>
                <TextField
                    type="email"
                    label="Required"
                    onChange={handleInputChange}
                    size="small"
                    name="email"
                    value={email}
                    placeholder="example@etu.minesparis.psl.eu"
                />
                <Button
                    type="submit"
                    variant="contained"
                    className="btn btn-success"
                    disabled={!isEmailCorrect()}
                    onClick={sendMail}
                    style={{ margin: "5vh 0" }}
                >
                    Demander un nouveau mot de passe
                </Button>

            </FormControl>
        </div>

        {postAsk && <div style={{ textAlign: "left", margin: "0 1vw 0 1vw" }}>
            <p>Vous avez demandé un nouveau mot de passe. Si on compte est associé à cette adresse mail, vous allez recevoir un mail.</p>
            <p>Cliquez sur le lien dans ce mail pour obtenir un nouveau mot de passe.</p>
        </div>}
    </>
}

