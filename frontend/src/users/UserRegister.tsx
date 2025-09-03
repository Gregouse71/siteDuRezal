import { FormControl, FormLabel, TextField, Button, Select, MenuItem, Checkbox } from "@mui/material";
import { useState } from "react";
import { promotions } from "../assets/lists";
import charte from "../assets/doc/Charte_VF.pdf";
import useAccountService from "../services/account.service";
import usePopupService from "../services/popup.service";

export default function UserRegister() {

    const accountService = useAccountService();
    const popupService = usePopupService();

    const regexEmail = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";

    const defaultFormValues = {
        prenom : "",
        nom : "", 
        email : "",
        emailBis : "",
        promotion : null,
        room : "",
        chartAccepted : false,
    } 
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [mode, setMode] = useState("Pre-registration");
    const [infoAssigned, setInfoAssigned] = useState({login : "", password : ""});
    
    const areValuesFilled = () => {
        return formValues.prenom !== "" &&
                formValues.nom !== "" && 
                formValues.email !== "" &&
                formValues.emailBis !== "" &&
                formValues.promotion !== null &&
                formValues.room !== ""
    }

    const isEmailFilled = () => {
        return formValues.email !== ""
    }

    const areEmailCorrects = () => formValues.email.match(regexEmail) && formValues.emailBis.match(regexEmail);
    
    const handleInputChange = (e : any) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
      };

    const passToCharterAccept = () =>  setMode("Charter-accept");

    const onRegister = () => {
        const password = accountService.createPassword();
        const login = (formValues.promotion + formValues.prenom.toLowerCase() + '.' + formValues.nom.toLowerCase()).replaceAll('\'', "").replaceAll(" ", "_");
        accountService.register({...formValues, login : login, mot_de_passe : password})
        .then((response : any) => {
            popupService.changePopup({status : "success", message : "Création du compte réussie"})
            setInfoAssigned({
                login : response.data.uid, // It is the login returned by the backend (may be different than the login sent)
                password : password
            })
            setMode("Post-registration")
        })
        .catch(error => {
            const errorStatus = error.response.status;
            switch(errorStatus) {
                case "400" : {
                    popupService.changePopup({status : "error", message : "Email déjà présent dans la base de données"});
                    break;
                }
                default : popupService.changePopup({status : "error", message : "Erreur inconnue"})
            }
        });
    }

    return <>
        {mode === "Pre-registration" && <> 
            <h2> Création de compte </h2>
        
            <div>
                <FormControl id="register-form" style={{fontSize : "0.7rem"}}>
                    <FormLabel style={{fontSize : "2em", margin : "2vh 0"}}>Prénom</FormLabel>
                    <TextField
                        onChange={handleInputChange}
                        size="small"
                        name="prenom"
                        value={formValues.prenom}
                        autoCapitalize="none"
                        autoCorrect="false"
                        placeholder="prénom"
                    />
                    
                    <FormLabel style={{fontSize : "2em", margin : "2vh 0"}}>Nom</FormLabel>
                    <TextField
                        onChange={(e) => handleInputChange(e)}
                        size="small"
                        name="nom"
                        value={formValues.nom}
                        placeholder="nom"
                    />

                    <FormLabel style={{fontSize : "2em", margin : "2vh 0"}}>Email</FormLabel>
                    <TextField
                        type="email"
                        onChange={(e) => handleInputChange(e)}
                        size="small"
                        name="email"
                        value={formValues.email}
                        placeholder="example@etu.minesparis.psl.eu"
                        error={formValues.email !== "" && !formValues.email.match(regexEmail)}
                        helperText={(formValues.email !== "" && !formValues.email.match(regexEmail)) ? "Email non valide" : ""}
                    />

                    {!isEmailFilled() && <p style={{color : "red"}}>
                        Email obligatoire 
                    </p>}

                    <div id="promotion-field">
                        <FormLabel style={{fontSize : "2em", margin : "2vh 0"}}>Promotion des Mines <br/></FormLabel>
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


                    <FormLabel style={{fontSize : "2em", margin : "2vh 0"}}>Chambre</FormLabel>
                    <TextField
                        onChange={(e) => handleInputChange(e)}
                        size="small"
                        name="room"
                        value={formValues.room}
                        placeholder="PAM | N° (ex : 666)"
                    />

                    <Button 
                        variant="contained" 
                        className="btn btn-success" 
                        disabled={!areValuesFilled() || !areEmailCorrects()} 
                        onClick={passToCharterAccept}
                        style={{margin : "5vh 0"}}
                    > 
                        Confirmer 
                    </Button>

                </FormControl>
            </div> 
        </>}

        {mode === "Charter-accept" && <>
            <h2> Charte d'utilisation du réseau par les étudiants </h2>
            <iframe
                title="file"
                style={{ width: '70vw', height: '150vh' }}
                src={charte}
            />
            <div style={{display : "flex", justifyContent : "center", gap : "10px"}}>
                <Checkbox
                    checked={formValues.chartAccepted}
                    onChange={() => setFormValues({...formValues, chartAccepted : !formValues.chartAccepted})}
                />
                <div style={{display : "flex", flexDirection : "column", justifyContent : "center"}}>
                    <span>
                        J'ai lu et j'accepte la <a className="link" href={charte} rel="noopener noreferrer" target = "_blank">charte d'utilisation du réseau par les étudiants</a>
                    </span>  
                </div>
            </div>
            <Button 
                variant="contained" 
                className="btn btn-success" 
                disabled={!(formValues.chartAccepted === true)} 
                onClick={onRegister}
                style={{margin : "5vh 0"}}
            > 
                Confirmer 
            </Button>
        </>}
        
        {mode === "Post-registration" && <div style={{textAlign : "left", margin : "0 1vw 0 1vw"}}>
            <h1> Informations de connexion </h1>
            <p>
                Tu n'as pas rentré de mot de passe dans le formulaire, c'est normal, il est créé par le Rézal afin qu'il te permette une connexion sécurisée. N'oublie pas de bien le noter, même si tu pourras en demander de nouveaux ! Tu y as accès en bas de la page et un email te sera envoyé avec les informations de connexion.
            </p>
            <h2>Vérification d'adresse mail</h2>
            <p>
                Afin d'être sûr que tu ne te sois pas trompé.e dans ton adresse email, nous avons envoyé un mail à l'adresse que tu as donné. Un lien cliquable est présent dans ce mail et te permet de faire vérifier cette adresse. Note bien que <b>tu ne pourras pas te connecter ni à ton compte ni au réseau tant que ton adresse ne sera pas vérifiée</b> !
            </p>
            <h2>Cotisation</h2>
            <p>
                Même après vérification de ton adresse mail, tu n'auras pas encore la possibilité de te connecter au réseau. Un membre de l'association qui dispose des accès admnisitrateurs doit d'abord récupérer ta cotisation. La cotisation est de <b>5€ par trimestre</b>, pour le découpage exact des trimestres, tu peux regarder dans ton espace résident ou poser la question à un membre de l'association, nous serons ravis de te répondre ! Il est préférable de cotiser par <b>chèque</b> ou <b>liquide</b>. <br/>
                Après cotisation et validation tu pourras accéder à internet avec tes identifiants. 
            </p>
            <h2>Nombre d'appareils connectés</h2>
            <p>
                Les règles du Rezal t'autorisent à connecter <b>3 appareils en même temps à un seul compte</b>
            </p>
            <h2> Identifiants </h2>
            <ul>
                <li>Login : {infoAssigned.login}</li>
                <li>Mot de passe : {infoAssigned.password}</li>
            </ul>
        </div>}
    </>
}

