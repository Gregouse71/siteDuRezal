import { Button } from "@mui/material";
import { useEffect, useState } from "react"
import { Account } from "../../models/account"
import useAccountService from "../../services/account.service";
import { useAdminService } from "../../services/admin.service";
import useCSVService from "../../services/csv.service";
import useDisplayService from "../../services/display.service";
import usePopupService from "../../services/popup.service";
import UserCreationCSV from "./UserCreation/UserCreationCSV";


export default function UserCreation() {

    const accountService = useAccountService();
    const adminService = useAdminService();
    const CSVService = useCSVService();
    const displayService = useDisplayService();
    const popupService = usePopupService();

    const [fieldsData, setFieldData] = useState(adminService.fieldsDisplayableInitWithPassword);
    const [users, setUsers] = useState<Array<Account>>([]); 

    const [errorsDetected, setErrorsDetected] = useState<string[]>([]);

    useEffect(() => {
        detectErrorsInUsers(users);
    }, [users])

    const detectErrorsInUsers = (users : Account[]) => {

        // Detect missing fields
        const errorsMissingFields = users.map(
            (user, index) => {
                
                const loginMissing = user.login === null || user.login === "";
                const passwordMissing = user.password === null || user.password === "";
                const emailMissing = user.email === null || user.email === ""

                const somethingsMissing = loginMissing || passwordMissing || emailMissing;
                
                if (somethingsMissing) {
                    return "Ligne " + index + " : " + (loginMissing ? "pas de login, " : "") + (passwordMissing ? "pas de mot de passe, " : "") + (emailMissing ? "pas d'email, " : "")
                } else {
                    return ""
                }
            }
        ).filter(errorMessage => errorMessage !== "");

        const findIndexesOfDuplicatedValue = (array : any[], valueDuplicated : string) => {
            const indexes = [];

            for (let index = 0; index < array.length; index++) {
                if (array[index] === valueDuplicated) {
                    indexes.push(index);
                }
            }

            return indexes;
        }

        // Detect duplicated logins
        const loginsNotNull : any[] = users.map(user => user.login).filter(login => login !== null);
        const loginsDuplicated = loginsNotNull.filter((login, index) => loginsNotNull.indexOf(login) !== index);
        const errorsLoginDuplicated = loginsDuplicated.length > 0 ? loginsDuplicated.map(
            login => {
                return "Login " + login + " dupliqué dans les lignes " + findIndexesOfDuplicatedValue(loginsNotNull, login).reduce((index, chars) => chars + ", " + index, "");
            }
        ) : [];

        // Detect duplicated emails
        const emailsNotNull : any[] = users.map(user => user.email).filter(email => email !== null);
        const emailsDuplicated = emailsNotNull.filter((email, index) => emailsNotNull.indexOf(email) !== index);
        const errorsEmailDuplicated = emailsDuplicated.length > 0 ? emailsDuplicated.map(
            email => {
                return "Email " + email + " dupliqué dans les lignes " + findIndexesOfDuplicatedValue(emailsNotNull, email).reduce((index, chars) => chars + ", " + index, "");
            }
        ) : [];

        
        const errorsArray = [...errorsMissingFields, ...errorsLoginDuplicated, ...errorsEmailDuplicated];

        setErrorsDetected(errorsArray);
    }

    const onCreationNewAccounts = () => {
        adminService.createAccounts(users)
            .then(response => {
                var isSucessForAll = true;
                const accountCreationDataArray = response.data;
                const newComputedUsers = users
                    .map((account, index) => {
                        const {success, id, error} = accountCreationDataArray[index];
                        if (success) return new Account({
                            ...account, 
                            id : id, 
                            message : "SCompte créé avec succès"
                        })
                        else {
                            isSucessForAll = false;
                            return new Account({
                                ...account, 
                                message : "E" + error
                            })
                        }
                    })
                setUsers(newComputedUsers);
                setFieldData({...fieldsData, id : true, message : true});
                if (isSucessForAll) {
                    popupService.changePopup({status : "success", message : "Import et création des comptes réussies"});
                } else {
                    popupService.changePopup({status : "warning", message : "Succès, mais certains comptes n'ont pas pu être créés, voir la colonne 'message'"});
                }

                // Upload of the result
                const usersSuccessfullyCreated = users
                    .map(account => {
                        return {
                            "Login" : account.login,
                            "Mot de passe" : account.password,
                            "Email" : account.email
                        }
                    })
                    .filter((accData, index) => accountCreationDataArray[index].success)

                if (usersSuccessfullyCreated.length > 0) CSVService.exportAsCSV(usersSuccessfullyCreated, "Compte créés");

            })
            .catch(error => {
                const errorStatus = error.request.status;
                switch (errorStatus) {
                    case 404 : {
                        popupService.changePopup({status :  "error", message : "Erreur de la requête"});
                        break
                    }
                    default : popupService.changePopup({status :  "error", message : "Erreur inconnue"});
                }
            });
    }

    const onAccountValueChange = (indexInUserTab : number, field : string, newValue : any) => {
        const newUsers = users.map(
            (user, index) => {
                if (index === indexInUserTab) {
                    user.complexChange(field, newValue)
                }
                return user
            }
        );
        setUsers(newUsers);
    }

    const onDeleteUser = (indexToDelete : number) => {
        if (window.confirm("Sur de vouloir supprimer la ligne " + indexToDelete + " ? Ce changement est définitif")) {
            const newUsers = users.filter((_, index) => index !== indexToDelete);
            setUsers(newUsers);
        }
    }

    const onAddUserManually = () => {
        const randomPassword = accountService.createPassword();
        setUsers([...users, new Account({password : randomPassword})]);
    }

    return <>
        <displayService.FieldsDisplayTab 
            fieldsData={fieldsData} 
            setFieldData={setFieldData}
        />

        {users.length > 0 && <p style={{textAlign : "center"}}>
            <Button 
                variant = "outlined"
                color = "warning"
                disabled = {errorsDetected.length > 0}
                onClick={onCreationNewAccounts} >
                    Créer les comptes 
            </Button>    
        </p>}

        {errorsDetected.length > 0 && <p style={{color : "red"}}>
            Erreurs détectées : {errorsDetected.length}
            <ul>
                {errorsDetected.map((error, index) => <li key={"Error detected user creation " + index}> {error} </li>)}
            </ul>
        </p>}

        <displayService.UsersTab
            users={users.map((user, index) => new Account({...user, id : index}))}
            fieldsData={fieldsData}
            hasSelectionColumn={false}
            IdsSelected={[]}
            areAllIdsSelected={false}
            mutable={true}
            onAccountValueChange={onAccountValueChange}
            onDeleteAccount={onDeleteUser}
            onSelectAccount={() => {}}
            onSelectAll={() => {}}
            highlightChangesRespectedToDatabaseAccount={false}
        />

        <div style={{display: "flex", justifyContent : "space-around"}}>
            <Button 
                variant = "outlined"
                color = "success"
                onClick={onAddUserManually} >
                    Ajouter un compte à créer
            </Button>    
            <UserCreationCSV setComputedUsersFromCSV={(computedUsers : Account[]) => setUsers([...users, ...computedUsers])}/>
        </div>
        
        
    
    </>

}