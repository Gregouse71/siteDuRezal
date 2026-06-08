import { Button, FormControl, TextField } from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Account } from "../../models/account";
import { databaseAccountsState, useAdminService } from "../../services/admin.service";
import useDisplayService from "../../services/display.service";
import usePopupService from "../../services/popup.service";
import UsersCSV from "./UsersManagement/UsersCSV";
import UsersFilters from "./UsersManagement/UsersFilters";

//Aux futurs qui liront ce code,
//Il avait en têtes des ID nombres pour chaque compte
//Ce jour j'entreprend le changement pour des ID string, les login
//Ca cassera peut-être des trucs et explique certaines étrangeté
//24liens

export default function UsersManager() {
    const adminService = useAdminService();
    const popupService = usePopupService();
    const displayService = useDisplayService();

    const [fieldsData, setFieldData] = useState(adminService.fieldsDisplayableInit);
    const [userFilters, setUserFilters] = useState({});
    const [mutable, setMutable] = useState(false);
    const [IdsSelected, setIdsSelected] = useState([]);
    const [areAllIdsSelected, setAreAllIdsSelected] = useState(false);

    //databaseAccounts est un miroir de l'état du serveur
    //CurrentAccounts est l'état des comptes affichés, avec les modifications qui ont été faites

    const [databaseAccounts, setDatabaseAccounts] = useRecoilState(databaseAccountsState);
    const [currentAccounts, setCurrentAccouts] = useState(adminService.copyMapAccounts(databaseAccounts));
    const [accountFiltered, setAccountFiltered] = useState(adminService.filterAccounts(currentAccounts, userFilters));

    const [query, setQuery] = useState("");

    useEffect(() => { // Will only trigger when UsersManager is called for the first time
        adminService.updateDatabaseView()
            .then(() => {})
            //.catch((error) => {})//TODO : Pourquoi un catch qui fait juste disparaître l'erreur
    }, []) 

    useEffect(() => {   
        setCurrentAccouts(adminService.copyMapAccounts(databaseAccounts));
    }, [databaseAccounts])

    useEffect(() => {
        setAccountFiltered(adminService.filterAccounts(currentAccounts, userFilters))
    }, [currentAccounts, userFilters])

    const arrayOfChanges = Array.from(currentAccounts)
        .map(IdAndAccount => {
            const id = IdAndAccount[0];
            const databaseAccount = databaseAccounts.get(id);
            return {...IdAndAccount[1].differenceWith(databaseAccount), id : id, uid:IdAndAccount[1].uid};
        })
        .filter(IdAndDiff => Object.keys(IdAndDiff).length > 2)

    const onSelectAccount = (idToggled) => {
        if (IdsSelected.includes(idToggled)) setIdsSelected(IdsSelected.filter(id => id !== idToggled))
        else setIdsSelected([...IdsSelected, idToggled])
    }
    
    const onSelectAll = () => {
        if (areAllIdsSelected) setIdsSelected([]);
        else setIdsSelected(accountFiltered.map(account => account.id))
        setAreAllIdsSelected(!areAllIdsSelected);
    }

    const onAccountValueChange = (id, field, newValue) => {
        var account = currentAccounts.get(id);
        if (account && !_.isEqual((account)[field], newValue)) {
            if (["login", "email"].includes(field) && newValue) {
                if (!window.confirm("Attention, modifier ce champ peut empecher un utilisateur d'accèder à son compte, confirmer ?")) {
                    setCurrentAccouts(
                        new Map(currentAccounts.set(id, account))
                    )
                    return null;
                }
            }
            if (IdsSelected.length > 1 && window.confirm("Appliquer ce changement sur les autres comptes sélectionnés ?")) {
                IdsSelected.forEach(
                    id => {
                        var account = currentAccounts.get(id);
                        if (account !== undefined) {
                            account.complexChange(field, newValue);
                            setCurrentAccouts(
                                new Map(currentAccounts.set(id, account))
                            )
                        }
                    }
                )
            } else {
                if (account) {
                    account.complexChange(field, newValue);
                    setCurrentAccouts(
                        new Map(currentAccounts.set(id, account))
                    )
                }
            }
        }
    } 

    const onCommitChanges = () => {
        if (window.confirm("Confirmer les changements demandés ?")) {
            var number_error = 0;
            adminService.modifyAccounts(arrayOfChanges)
            .then(accountModificationDataArray => {
                var isSucessForAll = true;
                arrayOfChanges
                    .forEach((IdAndAccount, index) => {
                        const id = IdAndAccount.id;
                        const promiseResult = accountModificationDataArray[index];
                        if (promiseResult.status === "fulfilled") currentAccounts.set(
                            id, new Account({
                                ...currentAccounts.get(id), 
                                message : "SCompte modifié avec succès"
                            })
                        ) 
                        else {
                            isSucessForAll = false;
                            number_error++;
                            currentAccounts.set(
                                id, new Account({
                                    ...databaseAccounts.get(id), 
                                    message : "E" + promiseResult.reason
                                })
                            )
                        }
                })
                setDatabaseAccounts(adminService.copyMapAccounts(currentAccounts));
                setFieldData({...fieldsData, message : true});
                if (isSucessForAll) {
                    popupService.changePopup({status :  "success", message : "Modifications réussies"});
                } else {
                    popupService.changePopup({status :  "error", message : `Nombre d'erreurs : ${number_error}. Certains comptes n'ont pas pu être créés, voir la colonne 'message'`});
                }
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
    }

    const onStashChanges = () => {
        if (window.confirm("Annuler les changements effectués ?")) {
            setCurrentAccouts(adminService.copyMapAccounts(databaseAccounts))
        }
    }

    const onDeleteAccount = (id) => {
        if (window.confirm("Confirmer la suppression de ce compte ?")) {
            var idsToDelete = [];            
            if (IdsSelected.length > 1 && IdsSelected.includes(id) && window.confirm("Effectuer cette action sur tous les comptes sélectionnés ? [Oui/Non]")) {
                idsToDelete = IdsSelected;
            } else {
                idsToDelete = [id]
            }
            const uidsToDelete = idsToDelete.map((id) => {
                return databaseAccounts.get(id)?.uid;
            });
            adminService.deleteAccounts(uidsToDelete).then(
                (accountDeletionStatus) => { 
                    idsToDelete.forEach(    
                        (idToDelete, index) => {
                            const account = currentAccounts.get(idToDelete);
                            if (account !== undefined) {
                                const message = accountDeletionStatus[index].status === "fulfilled" ? "SSuppression effectuée" : ("ESuppression non effectuée, raison : " + accountDeletionStatus[index].reason)
                                const accountWithMessage = new Account({
                                    ...account,
                                    message : message
                                })
                                currentAccounts.set(idToDelete, accountWithMessage)
                            }
                        }
                    )
                    setDatabaseAccounts(adminService.copyMapAccounts(currentAccounts));
                    setFieldData({...fieldsData, message : true})
                } 
            )
        } else {
            // Do nothing
        }
        
    }

    return <div id="user-manager">
        <displayService.FieldsDisplayTab fieldsData={fieldsData} setFieldData={setFieldData}/>
        <UsersFilters userFilters={userFilters} setUserFilters={setUserFilters} />

        <div className="d-flex">
            <Button  
                variant = "contained"
                color = "info"
                onClick={() => setMutable(!mutable)}>
                    {mutable ? "Sortir modifications": "Modifier"} 
            </Button>
        </div>
        {arrayOfChanges.length > 0 && <p>
            <Button  
                variant = "contained"
                color = "warning"
                onClick={onCommitChanges}>
                    {"Sauvegarder modifications"} 
            </Button>
            <Button  
                variant = "contained"
                color = "warning"
                onClick={onStashChanges}>
                    {"Annuler modifications"} 
            </Button>
        </p>}

        <displayService.UsersTab
            users={accountFiltered}
            fieldsData={fieldsData}
            hasSelectionColumn={true}
            IdsSelected={IdsSelected}
            areAllIdsSelected={areAllIdsSelected}
            mutable={mutable}
            onAccountValueChange={onAccountValueChange}
            onDeleteAccount={onDeleteAccount}
            onSelectAccount={onSelectAccount}
            onSelectAll={onSelectAll}
            highlightChangesRespectedToDatabaseAccount={true}
        />
        <UsersCSV currentAccounts={currentAccounts} setCurrentAccouts={setCurrentAccouts}/>

    </div>
}