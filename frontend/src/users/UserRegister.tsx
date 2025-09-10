import { FormControl, FormLabel, FormControlLabel, TextField, Button, Select, MenuItem, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { promotions } from "../assets/lists";
import charte from "../assets/doc/Charte_VF.pdf";
import useAccountService from "../services/account.service";
import usePopupService from "../services/popup.service";

export default function UserRegister() {

    const accountService = useAccountService();
    const popupService = usePopupService();

    const regexEmail = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
    const [charteAccepted, setCharteAccepted] = useState(false);

    const defaultFormValues = {
        prenom: "",
        nom: "",
        email: "",
        promotion: "",
        room: "",
        chartAccepted: false,
    }
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [mode, setMode] = useState("Charter-accept");

    const areValuesFilled = () => {
        return formValues.prenom !== "" &&
            formValues.nom !== "" &&
            formValues.email !== "" &&
            formValues.promotion !== "" &&
            formValues.room !== ""
    }

    const isEmailFilled = () => {
        return formValues.email !== ""
    }

    const isEmailCorrect = () => formValues.email.match(regexEmail);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const onRegister = () => {
        accountService.register(formValues)
            .then((response: any) => {
                popupService.changePopup({ status: "success", message: "Création du compte réussie" })
                setMode("Post-registration")
            })
            .catch(error => {
                const errorStatus = error.response.status;
                switch (errorStatus) {
                    case "400": {
                        popupService.changePopup({ status: "error", message: "Cette adresse mail est déjà utilisée par un utilisateur" });
                        break;
                    }
                    default: popupService.changePopup({ status: "error", message: "Erreur inconnue" })
                }
            });
    }

    return <>
        {mode === "Charter-accept" && <>
            <h2> Charte d'utilisation du réseau par les étudiants </h2>
            <iframe
                title="file"
                style={{ width: '70vw', height: '150vh' }}
                src={charte}
            />

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <FormControlLabel
                    required
                    control={<Checkbox />}
                    label="J'ai lu et j'accepete la charte d'utilisation du réseau"
                    checked={charteAccepted}
                    onChange={() => setCharteAccepted(!charteAccepted)}
                />
            </div>
            <Button
                variant="contained"
                className="btn btn-success"
                disabled={!charteAccepted}
                onClick={() => { setMode("Pre-registration") }}
                style={{ margin: "5vh 0" }}
            >
                Confirmer
            </Button>
        </>}

        {mode === "Pre-registration" && <>
            <h2> Création de compte </h2>

            <div>
                <FormControl id="register-form" style={{ fontSize: "0.7rem" }}>
                    <FormLabel style={{ fontSize: "2em", margin: "2vh 0" }}>Prénom</FormLabel>
                    <TextField
                        onChange={handleInputChange}
                        size="small"
                        name="prenom"
                        value={formValues.prenom}
                        autoCapitalize="none"
                        autoCorrect="false"
                        placeholder="prénom"
                        label="Required"

                    />

                    <FormLabel style={{ fontSize: "2em", margin: "2vh 0" }}>Nom</FormLabel>
                    <TextField
                        onChange={(e) => handleInputChange(e)}
                        size="small"
                        name="nom"
                        value={formValues.nom}
                        placeholder="nom"
                        label="Required"
                    />

                    <FormLabel style={{ fontSize: "2em", margin: "2vh 0" }}>Email</FormLabel>
                    <TextField
                        type="email"
                        label="Required"
                        onChange={(e) => handleInputChange(e)}
                        size="small"
                        name="email"
                        value={formValues.email}
                        placeholder="example@etu.minesparis.psl.eu"
                        error={formValues.email !== "" && !formValues.email.match(regexEmail)}
                        helperText={(formValues.email !== "" && !formValues.email.match(regexEmail)) ? "Email non valide" : ""}
                    />

                    {!isEmailFilled() && <p style={{ color: "red" }}>
                        Email obligatoire
                    </p>}

                    <div id="promotion-field">
                        <FormLabel style={{ fontSize: "2em", margin: "2vh 0" }}>Promotion des Mines <br /></FormLabel>
                        <small>(XX si vous n'êtes pas de l'école des Mines)</small>
                        <Select value={formValues.promotion}
                            name="promotion"
                            size="small"
                            onChange={(e) => handleInputChange(e)} >

                            {promotions.map(el => <MenuItem
                                key={"promotion value choice " + el}
                                value={el}
                            >
                                {el}
                            </MenuItem>
                            )}
                        </Select>
                    </div>


                    <FormLabel style={{ fontSize: "2em", margin: "2vh 0" }}>Chambre</FormLabel>
                    <TextField
                        onChange={(e) => handleInputChange(e)}
                        size="small"
                        name="room"
                        value={formValues.room}
                        placeholder="PAM | N° (ex : 666)"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        className="btn btn-success"
                        disabled={!areValuesFilled() || !isEmailCorrect()}
                        onClick={onRegister}
                        style={{ margin: "5vh 0" }}
                    >
                        Confirmer
                    </Button>

                </FormControl>
            </div>
        </>}

        {mode === "Post-registration" && <div style={{ textAlign: "left", margin: "0 1vw 0 1vw" }}>
            <h2>Création de compte réussi !</h2>
            <p>Ton compte a bien été créé. Tu vas recevoir un mail dans lequel se trouve un lien qui te permettra de récupérer tes identifiants.</p>
        </div>}
    </>
}
