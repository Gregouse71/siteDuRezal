import { atom, useSetRecoilState } from "recoil";
import { defaultFilterName } from "../admin/admin-features/UsersManagement/UsersFilters";
import { Account } from "../models/account"
import httpInstance from "./api"
import { useDateService } from "./date.service";

export const databaseAccountsState = atom({
    key : "databaseAccounts",
    default : new Map<number, Account>()
});

export function useAdminService() {

    const dateService = useDateService();
    
    const setDatabaseAccounts = useSetRecoilState(databaseAccountsState);

    const copyMapAccounts = (map : Map<number, Account>) => {
        return new Map(Array.from(map).map(IdAndAccount => [IdAndAccount[0], new Account(IdAndAccount[1])]));
    }

    const updateDatabaseView = () => {
        return new Promise<void>((resolve, reject) => {
            httpInstance.get('list/all')
            .then(response => {
                const accountsData = response.data;
                if (Array.isArray(accountsData)) {
                    //Le code était pensé pour recevoir un identifiant unique de chaque compte, sous la forme d'un nombre
                    //Pour minimiser les changements à faire dans le code, on ajoute un identifiant entier en fonction de sa 
                    //place dans la liste des comptes (et vous avez deviné la largeur de mon écran)
                    const mapAccounts = accountsData.reduce(function(map, accountData) {
                        map.set(accountData.id, new Account(accountData)) 
                        return map;
                    }, new Map<number, Account>())
                    setDatabaseAccounts(mapAccounts);
                    resolve()
                }
            })
            .catch(error => reject(error))
        })
    }

    const getRadiusUsers = () => {
        return new Promise<Array<string>>((resolve, reject) => {
            httpInstance.get('radius_users')
            .then(response => {
                const loginsInRadius = response.data;
                resolve(loginsInRadius);
            })
            .catch(error => reject(error))

        })
    }
    
    const createAccounts = (accounts : Account[]) => {
        return new Promise<any>((resolve, reject) => {
            httpInstance.post('users', accounts)
            .then(response => resolve(response))
            .catch(error => reject(error))
        })
    }
    
    const modifyAccounts = (changesOnAccounts : any[]) => {
        const promiseArray = changesOnAccounts.map((change) =>
            httpInstance.patch('users/'+change.uid, change)
        );
        return Promise.allSettled(promiseArray)
    }

    const deleteAccounts = (uidsToDelete : any[]) => {
        // new Promise<boolean[]>((resolve, reject) => {
        //     httpInstance.delete('users', {data : idsToDelete})
        //     .then((response : any) => resolve(response.data))
        //     .catch(error =>  reject(error))
        // })
        const promiseArray = uidsToDelete.map((toDelete) =>
            httpInstance.delete('users/'+toDelete)
        );
        console.log(promiseArray);
        return Promise.allSettled(promiseArray);
    }

    const filterAccounts = (accounts : Map<number, Account>, userFilters : any) => {
        var selectedAccounts : Account[] = [];
        accounts.forEach(account => {
            if (doesAccountVerifyAllFilters(account, userFilters)) selectedAccounts.push(account)
        })
        return selectedAccounts
    }

    const doesAccountVerifyAllFilters = (account : Account, userFilters : any) => {
        const userFiltersNames = Object.keys(userFilters).filter(userFiltersName => userFiltersName !== defaultFilterName);
        if (userFiltersNames.length > 0) {
            return userFiltersNames
                .map(userFilterName => {
                    const userFilter = userFilters[userFilterName];
                    const accountSatisfyThisFilter = doesAccountVerifyFilter(account, userFilterName, userFilter.value)
                    return userFilter.inverted ? !accountSatisfyThisFilter : accountSatisfyThisFilter 
                })
                .every(val => val === true)
        } else return true
        
    }

    const doesAccountVerifyFilter = (account : Account, filterName : string, filterValue : any) => {

        const accountFilteredFieldValue : any = account.get(filterName);
        switch (filterName) {
            case "id" : return accountFilteredFieldValue?.toString().includes(filterValue)
            case "acces_wifi" : return accountFilteredFieldValue === filterValue
            case "is_admin" : return accountFilteredFieldValue === filterValue
            case "prenom" : return accountFilteredFieldValue?.includes(filterValue)
            case "nom" : return accountFilteredFieldValue?.includes(filterValue)
            case "uid" : return accountFilteredFieldValue?.includes(filterValue)
            case "email" : return accountFilteredFieldValue?.includes(filterValue)
            case "email_verifie" : return accountFilteredFieldValue === filterValue
            case "room" : return accountFilteredFieldValue?.includes(filterValue)
            case "promotion" : return accountFilteredFieldValue === filterValue
            case "cotizT1" : return accountFilteredFieldValue === filterValue
            case "t1PaymentType" : return accountFilteredFieldValue === filterValue
            case "t1PaidAt" : return dateService.dateToString(accountFilteredFieldValue).includes(filterValue)
            case "cotizT2" : return accountFilteredFieldValue === filterValue
            case "t2PaymentType" : return accountFilteredFieldValue === filterValue
            case "t2PaidAt" : return dateService.dateToString(accountFilteredFieldValue).includes(filterValue)
            case "cotizT3" : return accountFilteredFieldValue === filterValue
            case "t3PaymentType" : return accountFilteredFieldValue === filterValue
            case "t3PaidAt" : return dateService.dateToString(accountFilteredFieldValue).includes(filterValue)
            case "createdAt" : return dateService.dateToString(accountFilteredFieldValue).includes(filterValue)
            default : return false
        }
    }

    const fieldsDisplayableInit : any = {
        "id" : true,
        "acces_wifi" : true,
        "is_admin" : false,
        "prenom" : false,
        "nom" : false,
        "uid" : true,
        "email" : false,
        "email_verifie" : false,
        "room" : false,
        "promotion" : false,
        "T1" : true,
        "T2" : true,
        "T3" : true,
        "createdAt" : false,
        "message" : true
    }

    const fieldsDisplayableInitWithPassword : any = {
        "id" : true,
        "acces_wifi" : true,
        "admin" : true,
        "firstName" : false,
        "lastName" : false,
        "login" : true,
        "password" : true,
        "email" : true,
        "room" : false,
        "promotion" : false,
        "T1" : true,
        "T2" : true,
        "T3" : true,
        "createdAt" : false,
        "message" : true
    }


    return {
        databaseAccountsState : databaseAccountsState,
        updateDatabaseView : updateDatabaseView,
        getRadiusUsers : getRadiusUsers,
        createAccounts : createAccounts,
        modifyAccounts : modifyAccounts,
        deleteAccounts : deleteAccounts,
        filterAccounts : filterAccounts,
        copyMapAccounts : copyMapAccounts,
        fieldsDisplayableInit : fieldsDisplayableInit,
        fieldsDisplayableInitWithPassword : fieldsDisplayableInitWithPassword
    }
    
}
