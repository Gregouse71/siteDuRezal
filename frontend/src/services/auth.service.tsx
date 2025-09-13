import { FormControl, FormLabel, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import { Account } from '../models/account';
import httpInstance from './api';
import usePopupService from './popup.service';
import './services.scss'

export const userState = atom({
    key : "userState",
    default : new Account({})
})

export function useAuthService() {

    const [user, setUser] = useRecoilState(userState);
    const resetUser = useResetRecoilState(userState);

    const saveToken = (userToken : any) => localStorage.setItem('rezal-token', userToken);
    const removeTokenSaved = () => localStorage.removeItem('rezal-token')

    /**
     * Fait la procédure de login à partir du nom d'utilisateur et du mot de passe.
     * À la suite de ça, *rezal-token* contient le token d'identification.
     */
    const login = (login : string, password : string) => {
        const params = new URLSearchParams ({"username" : login, "password" : password})
        return new Promise<void>((resolve, reject) => {
            httpInstance.post(
                "auth/token",
                params.toString (),
                {headers: {'Content-Type': 'application/x-www-form-urlencoded'},})
            .then((response : any) => {
                saveToken(response.data.access_token);
                resolve();
            })
            .catch(error => reject(error))
        })
    }

    const loginFromIDAndToken = () => {
        return new Promise<boolean>((resolve, reject) => {
            try {
                httpInstance.get("users/me")
                .then((response_user_info : any) => {
                    setUser(new Account(response_user_info.data))
                    resolve(response_user_info.data.admin);
                })
                .catch(error => {
                    
                    reject(error);
                })
            } catch(error) {
                reject(error);
            }
        });
    }

    const logout = () => {
        removeTokenSaved();
        resetUser();
    }

    const updateUser = () => {
        
    }

    const LoginFormComponent = (props : any) => {

        const popupService = usePopupService();
        const defaultFormValues = {login : "", password : ""};
        const [formValues, setFormValues] = useState(defaultFormValues);

        const areValuesFilled = () => formValues.login !== "" && formValues.password !== "";
        
        const handleInputChange = (e : any) => {
            const { name, value } = e.target;
            setFormValues({
              ...formValues,
              [name]: value,
            });
          };
    
        const navigate = useNavigate();
        const onLogin = () => {
            if (areValuesFilled()) {
                login(formValues.login, formValues.password)
                .then(() => {
                    popupService.changePopup({status :  "success", message : "Connexion réussie"});
                    navigate(props.redirectionPathIfSuccess);
                })
                .catch(error => {
                    const errorStatus = error.response.status;
                    const errorMessage = error.response.data.detail;
                    switch (errorStatus) {
                        case 401 : {
                            switch(errorMessage) {
                                case "Incorrect username or password" : {
                                    popupService.changePopup({status :  "error", message : "Connexion refusée : mauvais login/mot de passe"});
                                    break;
                                }
                                case "Email not verified" : {
                                    popupService.changePopup({status :  "error", message : "Connexion refusée : email non vérifié"});
                                    break;
                                }
                                default : popupService.changePopup({status :  "error", message : "Connexion refusée : raison inconnue"});
                            }
                            break
                        }
                        case 404 : {
                            popupService.changePopup({status :  "error", message : "Erreur de la requête"});
                            break
                        }
                        default : popupService.changePopup({status :  "error", message : "Erreur inconnue"});
                    }
                });
            }
        }

        return <>
        <h2> {props.titre} </h2>

        <div>
            <FormControl id="login-form">
                <FormLabel style={{fontSize : "2rem", margin : "5vh 0"}}>Login</FormLabel>
                <TextField
                    onChange={handleInputChange}
                    onKeyDown={(e) => {if (e.key === "Enter") onLogin()}}
                    name="login"
                    value={formValues.login}
                    autoCapitalize="none"
                    autoCorrect="false"
                    placeholder="login"
                />
                
                <FormLabel style={{fontSize : "2rem", margin : "5vh 0"}}>Mot de passe</FormLabel>
                <TextField
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={(e) => {if (e.key === "Enter") onLogin()}}
                    name="password"
                    type="password"
                    value={formValues.password}
                    placeholder="mot de passe"
                />

                <Button 
                    variant="contained" 
                    className="btn btn-success" 
                    disabled={!areValuesFilled()} 
                    onClick={onLogin}
                    style={{margin : "5vh 0"}}
                > 
                    Connexion 
                </Button>
            </FormControl>
            {props.displayAccountCreationLink && <Link to="/resident/register" style={{fontSize : "1rem", color : "blue"}}> Pas de compte ? </Link>}<br/>
            {props.displayAccountCreationLink && <Link to="/resident/new-password" style={{fontSize : "1rem", color : "blue"}}> Mot de passe oublié ? </Link>}
        </div>
        </>
    }

    return {
        login : login,
        loginFromIDAndToken : loginFromIDAndToken,
        logout : logout,
        setUser: setUser, user : user,
        LoginFormComponent : LoginFormComponent,
    }

}

