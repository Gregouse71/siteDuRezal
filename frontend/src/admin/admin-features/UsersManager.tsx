import { Button } from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Account } from "../../models/account";
import { databaseAccountsState, useAdminService } from "../../services/admin.service";
import useDisplayService from "../../services/display.service";
import usePopupService from "../../services/popup.service";
import UsersCSV from "./UsersManagement/UsersCSV";
import UsersFilters from "./UsersManagement/UsersFilters";

export default function UsersManager() {
    const adminService = useAdminService();
    const popupService = usePopupService();
    const displayService = useDisplayService();

    const [fieldsData, setFieldData] = useState(adminService.fieldsDisplayableInit);
    const [userFilters, setUserFilters] = useState({});
    const [mutable, setMutable] = useState(false);
    const [IdsSelected, setIdsSelected] = useState<number[]>([]);
    const [areAllIdsSelected, setAreAllIdsSelected] = useState(false);

    const [databaseAccounts, setDatabaseAccounts] = useRecoilState(databaseAccountsState);
    const [currentAccounts, setCurrentAccouts] = useState<Map<number, Account>>(adminService.copyMapAccounts(databaseAccounts));
    const [accountFiltered, setAccountFiltered] = useState(adminService.filterAccounts(currentAccounts, userFilters));


    // console.log({newCurrentsAccounts : currentAccounts, accountFiltered : accountFiltered, databaseAccounts : databaseAccounts});

    useEffect(() => { // Will only trigger when UsersManager is called for the first time
        adminService.updateDatabaseView()
            .then(() => {})
            .catch((error) => {})
    }, []) 

    useEffect(() => {   
        setCurrentAccouts(adminService.copyMapAccounts(databaseAccounts));
    }, [databaseAccounts])

    useEffect(() => {
        setAccountFiltered(adminService.filterAccounts(currentAccounts, userFilters))
    }, [currentAccounts, userFilters])

    const arrayOfChanges : Array<any> = Array.from(currentAccounts)
        .map(IdAndAccount => {
            const id = IdAndAccount[0];
            const databaseAccount = databaseAccounts.get(id);
            return {...IdAndAccount[1].differenceWith(databaseAccount), id : id};
        })
        .filter(IdAndDiff => Object.keys(IdAndDiff).length > 1)

    const onSelectAccount = (idToggled : number) => {
        if (IdsSelected.includes(idToggled)) setIdsSelected(IdsSelected.filter(id => id !== idToggled))
        else setIdsSelected([...IdsSelected, idToggled])
    }

    const onSelectAll = () => {
        if (areAllIdsSelected) setIdsSelected([]);
        else setIdsSelected(accountFiltered.map(account => account.id))
        setAreAllIdsSelected(!areAllIdsSelected);
    }

    const onAccountValueChange = (id : number, field : string, newValue : any) => {
        var account = currentAccounts.get(id);
        if (account && !_.isEqual((account as any)[field], newValue)) {
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
            adminService.modifyAccounts(arrayOfChanges)
            .then(accountModificationDataArray => {
                var isSucessForAll = true;
                arrayOfChanges
                    .forEach((IdAndAccount, index) => {
                        const id : number = IdAndAccount.id;
                        const {success, error} = accountModificationDataArray[index];
                        if (success) currentAccounts.set(
                            id, new Account({
                                ...currentAccounts.get(id), 
                                message : "SCompte modifié avec succès"
                            })
                        ) 
                        else {
                            isSucessForAll = false;
                            currentAccounts.set(
                                id, new Account({
                                    ...databaseAccounts.get(id), 
                                    message : "E" + error
                                })
                            )
                        }
                })
                setDatabaseAccounts(adminService.copyMapAccounts(currentAccounts));
                setFieldData({...fieldsData, message : true});
                if (isSucessForAll) {
                    popupService.changePopup({status :  "success", message : "Modifications réussies"});
                } else {
                    popupService.changePopup({status :  "success", message : "Certains comptes n'ont pas pu être créés, voir la colonne 'message'"});
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

    const onDeleteAccount = (id : number) => {
        if (window.confirm("Confirmer la suppression de ce compte ?")) {
            var idsToDelete : Array<number> = [];            
            if (IdsSelected.length > 1 && IdsSelected.includes(id) && window.confirm("Effectuer cette action sur tous les comptes sélectionnés ? [Oui/Non]")) {
                idsToDelete = IdsSelected;
            } else {
                idsToDelete = [id]
            }
            adminService.deleteAccounts(idsToDelete).then(
                (accountDeletionStatus : any[]) => { 
                    idsToDelete.forEach(    
                        (idToDelete : number, index : number) => {
                            const account = currentAccounts.get(idToDelete);
                            if (account !== undefined) {
                                const message = accountDeletionStatus[index].success ? "SSuppression effectuée" : ("ESuppression non effectuée, raison : " + accountDeletionStatus[index].error)
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

        <p>
            <Button  
                variant = "contained"
                color = "info"
                onClick={() => setMutable(!mutable)}>
                    {mutable ? "Sortir modifications": "Modifier"} 
            </Button>
        </p>
        
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