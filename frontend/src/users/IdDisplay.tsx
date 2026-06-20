import { FormControl, FormLabel, Button, InputAdornment, IconButton, OutlinedInput, Box, Typography, LinearProgress, colors } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAccountService from "../services/account.service";
import usePopupService from "../services/popup.service";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useMemo } from "react";

const passwordStrengthCriteria = [
    { regex: /.{8,}/, message: "Au moins 8 caractères" },
    { regex: /[a-z]/, message: "Une minuscule" },
    { regex: /[A-Z]/, message: "Une majuscule" },
    { regex: /[0-9]/, message: "Un chiffre" },
    { regex: /[^A-Za-z0-9]/, message: "Un caractère spécial (ex: !@#$)" },
];

const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const requiredChecks: any = [];
    const passedChecks = [];

    if (password.length > 0) {
        passwordStrengthCriteria.forEach(criterion => {
            const passed = criterion.regex.test(password);
            requiredChecks.push({ ...criterion, passed });
            if (passed) {
                score++;
                passedChecks.push(criterion.message);
            }
        });
    }

    // Convert score to a percentage (0 to 100)
    const strengthPercentage = (score / passwordStrengthCriteria.length) * 100;
    const isStrong = score === passwordStrengthCriteria.length;

    return {
        score,
        strengthPercentage,
        requiredChecks,
        isStrong,
    };
};

export default function DisplayID() {
    const { token } = useParams();
    const navigate = useNavigate();

    const accountService = useAccountService();
    const popupService = usePopupService();

    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);
    const { strengthPercentage, isStrong, requiredChecks } = passwordStrength;

    const onChange = () => {
        accountService.setNewPassword({ token: token, password: password })
            .then((_response: any) => {
                popupService.changePopup({ status: "success", message: "Mot de passe créé" })
                navigate("/");
            })
            .catch(error => {
                const errorStatus = error.response.status;
                switch (errorStatus) {
                    case 400: {
                        popupService.changePopup({ status: "error", message: "Impossible de créer le mot de passe" });
                        break;
                    }
                    case 401: {
                        popupService.changePopup({ status: "error", message: "Le lien d'identification a expiré. Recommencez la procédure de nouveau mot de passe." });
                        break;
                    }
                    default: popupService.changePopup({ status: "error", message: "Erreur inconnue" })
                }
            });
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const getStrengthColor = (percentage: number) => {
        if (percentage < 33) return colors.red[500];
        if (percentage < 66) return colors.orange[500];
        if (percentage < 100) return colors.yellow[700];
        return colors.green[500];
    };

    return <>
        <FormControl id="new-password-form">
            <FormLabel style={{ fontSize: "2em", margin: "2vh 0" }}>Nouveau mot de passe</FormLabel>
            <OutlinedInput
                onChange={(e: any) => setPassword(e.target.value)}
                type={show1 ? 'text' : 'password'}
                size="small"
                name="Mot de passe"
                value={password}
                placeholder="Mot de passe"
                endAdornment={<InputAdornment position="end">
                    <IconButton
                        aria-label={
                            show1 ? 'hide the password' : 'display the password'
                        }
                        onClick={() => setShow1(!show1)}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                    >
                        {show1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>}
            />
            {password.length > 0 && (
                <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={strengthPercentage}
                        sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: colors.grey[300],
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: getStrengthColor(strengthPercentage),
                            },
                        }}
                    />
                    <Box sx={{ mt: 1 }}>
                        {requiredChecks.map((check: any, index: any) => (
                            <Typography
                                key={index}
                                variant="caption"
                                display="block"
                                sx={{
                                    color: check.passed ? colors.green[700] : colors.grey[600],
                                    fontWeight: check.passed ? 'bold' : 'normal',
                                }}
                            >
                                {check.passed ? '✓' : '•'} {check.message}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            )}
            <FormLabel style={{ fontSize: "2em", margin: "2vh 0" }}>Répéter le mot de passe</FormLabel>
            <OutlinedInput
                onChange={(e: any) => setPasswordAgain(e.target.value)}
                type={show2 ? 'text' : 'password'}
                size="small"
                name="Mot de passe"
                value={passwordAgain}
                placeholder="Mot de passe"
                endAdornment={<InputAdornment position="end">
                    <IconButton
                        aria-label={
                            show2 ? 'hide the password' : 'display the password'
                        }
                        onClick={() => setShow2(!show2)}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                    >
                        {show2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>}
            />
            {passwordAgain.length > 0 && password !== passwordAgain && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    Les mots de passe ne correspondent pas.
                </Typography>
            )}
            <Button
                type="submit"
                variant="contained"
                className="btn btn-success"
                disabled={password !== passwordAgain || !isStrong}
                onClick={onChange}
                style={{ margin: "5vh 0" }}
            >
                Confirmer
            </Button>

        </FormControl>
    </>
}

