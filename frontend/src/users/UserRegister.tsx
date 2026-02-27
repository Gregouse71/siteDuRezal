import { FormControl, FormLabel, FormControlLabel, TextField, Button, Select, MenuItem, Checkbox, Box, Typography, Container, Grid } from "@mui/material";
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
        promotion: "XX",
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
                    case 400: {
                        popupService.changePopup({ status: "error", message: "Cette adresse mail est déjà utilisée par un utilisateur" });
                        break;
                    }
                    default: popupService.changePopup({ status: "error", message: "Erreur inconnue" })
                }
            });
    }

    return <>
        {mode === "Charter-accept" &&
            <Container maxWidth="md">
                <Box sx={{ my: 4 }}>
                    <Box sx={{ p: 2, border: '1px solid grey.300', borderRadius: 1 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Charte d'utilisation du réseau par les étudiants
                        </Typography>
                        <Box sx={{ height: '70vh', my: 2 }}>
                            <iframe
                                title="file"
                                style={{ width: '100%', height: '100%' }}
                                src={charte}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <FormControlLabel
                                required
                                control={<Checkbox checked={charteAccepted} onChange={() => setCharteAccepted(!charteAccepted)} />}
                                label="J'ai lu et j'accepte la charte d'utilisation du réseau"
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!charteAccepted}
                            onClick={() => { setMode("Pre-registration") }}
                            fullWidth
                        >
                            Confirmer
                        </Button>
                    </Box>
                </Box>
            </Container>
        }

        {mode === "Pre-registration" &&
            <Container maxWidth="sm">
                <Box sx={{ my: 4 }}>
                    <Box sx={{ p: 2, border: '1px solid grey.300', borderRadius: 1 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Création de compte
                        </Typography>
                        <Box component="form" noValidate autoComplete="off">
                            <TextField
                                label="Prénom"
                                name="prenom"
                                value={formValues.prenom}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Nom"
                                name="nom"
                                value={formValues.nom}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formValues.email}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                required
                                error={formValues.email !== "" && !isEmailCorrect()}
                                helperText={(formValues.email !== "" && !isEmailCorrect()) ? "Email non valide" : ""}
                            />
                            <FormControl margin="normal">
                                <Grid size={12} container>
                                    <Grid size={6}><FormLabel>Promotion des Mines</FormLabel></Grid>
                                    <Grid size={6}><Select
                                        name="promotion"
                                        value={formValues.promotion}
                                        onChange={handleInputChange}
                                        sx={{ textAlign: 'left', width: '1fr%' }}
                                    >
                                        {promotions.map((el, ind) => (
                                            <MenuItem key={el} value={el}>
                                                {el !== "XX" ? el : "Exterieur"}
                                            </MenuItem>
                                        ))}
                                    </Select></Grid>
                                </Grid>
                            </FormControl>
                            <TextField
                                label="Chambre"
                                name="room"
                                value={formValues.room}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                placeholder="PAM | N° (ex : 666)"
                                required
                            />
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onRegister}
                                    disabled={!areValuesFilled() || !isEmailCorrect()}
                                    fullWidth
                                >
                                    Confirmer
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        }

        {mode === "Post-registration" &&
            <Container maxWidth="sm">
                <Box sx={{ my: 4 }}>
                    <Box sx={{ p: 2, border: '1px solid grey.300', borderRadius: 1 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Création de compte réussi !
                        </Typography>
                        <Typography variant="body1">
                            Ton compte a bien été créé. Tu vas recevoir un mail d'ici quelques minutes dans lequel se trouve un lien qui te permettra de récupérer tes identifiants. Tu as une semaine pour cliquer dessus pour valider ton inscription.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        }
    </>
}
