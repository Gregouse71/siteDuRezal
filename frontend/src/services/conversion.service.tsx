import { Account } from "../models/account";
import { AccountXLSX } from "../models/accountXLSX";
import { useDateService } from "./date.service";

export default function useConversionService() {

    const dateService = useDateService()

    const accountFieldsNameInEnglish = Object.keys(new Account({}));
    const accountFieldsNameInEnglishWithoutPassword = Object.keys(new Account({})).filter(key => key !== "password");

    const translateAccountFieldNameInFrench = (field : string) => {
      switch(field) {
        case "id" : return "#"
        case "acces_wifi" : return "Acces a internet"
        case "admin" : return "Admin"
        case "firstName" : return "Prenom"
        case "lastName" : return "Nom"
        case "login" : return "Login"
        case "password" : return "Mot de passe"
        case "email" : return "Email"
        case "emailIsVerified" : return "Email verifie"
        case "room" : return "Chambre"
        case "university" : return "Ecole"
        case "promotion" : return "Promotion"
        case "cotizT1" : return "T1 paye"
        case "t1PaymentType" : return "Moyen de paiement T1"
        case "t1PaidAt" : return "Date paiement T1"
        case "cotizT2" : return "T2 paye"
        case "t2PaymentType" : return "Moyen de paiement T2"
        case "t2PaidAt" : return "Date paiement T2"
        case "cotizT3" : return "T3 paye"
        case "t3PaymentType" : return "Moyen de paiement T3"
        case "t3PaidAt" : return "Date paiement T3"
        case "createdAt" : return "Date de creation"
        default : return field
      }
    }

    const accountFieldsNameInFrench = Object.keys(new Account({})).map(key => translateAccountFieldNameInFrench(key));
    
    const translateAccountFieldNameInEnglish = (field : string) => {
      switch(field) {
        case "#" : return "id"
        case "Acces a internet" : return "acces_wifi"
        case "Admin" : return "admin"
        case "Prenom" : return "firstName"
        case "Nom" : return "lastName"
        case "Login" : return "login"
        case "Mot de passe" : return "password"
        case "Email" : return "email"
        case "Email verifie" : return "emailIsVerified"
        case "Chambre" : return "room"
        case "Ecole" : return "university"
        case "Promotion" : return "promotion"
        case "T1 paye" : return "cotizT1"
        case "Moyen de paiement T1" : return "t1PaymentType"
        case "Date paiement T1" : return "t1PaidAt"
        case "T2 paye" : return "cotizT2"
        case "Moyen de paiement T2" : return "t2PaymentType"
        case "Date paiement T2" : return "t2PaidAt"
        case "T3 paye" : return "cotizT3"
        case "Moyen de paiement T3" : return "t3PaymentType"
        case "Date paiement T3" : return "t3PaidAt"
        case "Date de creation" : return "createdAt"
        default : return field
      }
    }

    const AccountToXLSXAccount = (account : Account) => {
        var newAccountXLSX = new AccountXLSX({});
        newAccountXLSX["#"] = account.id;
        newAccountXLSX["Acces a internet"] = account.acces_wifi? 1 : 0;
        newAccountXLSX.Admin = account.is_admin? 1 : 0;
        newAccountXLSX.Prenom = account.prenom !== null ? account.prenom : "";
        newAccountXLSX.Nom = account.nom !== null ? account.nom : "";
        newAccountXLSX.Login = account.uid !== null ? account.uid : "";
        newAccountXLSX["Mot de passe"] = account.password !== null ? account.password : "";
        newAccountXLSX.Email = account.email !== null ? account.email : "";
        newAccountXLSX["Email verifie"] = account.is_admin? 1 : 0;
        newAccountXLSX.Chambre = account.room !== null ? account.room : "";
        newAccountXLSX.Ecole = account.university;
        newAccountXLSX.Promotion = account.promotion;
        newAccountXLSX["T1 paye"] = account.cotizT1? 1 : 0;
        newAccountXLSX["Moyen de paiement T1"] = account.t1PaymentType;
        newAccountXLSX["Date paiement T1"] = dateService.dateToString(account.t1PaidAt);
        newAccountXLSX["T2 paye"] = account.cotizT2? 1 : 0;
        newAccountXLSX["Moyen de paiement T2"] = account.t2PaymentType;
        newAccountXLSX["Date paiement T2"] = dateService.dateToString(account.t2PaidAt);
        newAccountXLSX["T3 paye"] = account.cotizT3? 1 : 0;
        newAccountXLSX["Moyen de paiement T3"] = account.t3PaymentType;
        newAccountXLSX["Date paiement T3"] = dateService.dateToString(account.t3PaidAt);
        newAccountXLSX["Date de creation"] = dateService.dateToString(account.createdAt);
        return newAccountXLSX;
      }
  
      const XLSXAccountToAccount = (accountXLSX : AccountXLSX) => {
        var newAccount = new Account({});
        newAccount.id = accountXLSX["#"];
        newAccount.acces_wifi = accountXLSX["Acces a internet"] === 1 ? true : false;
        newAccount.is_admin = accountXLSX.Admin === 1 ? true : false;
        newAccount.prenom = accountXLSX.Prenom;
        newAccount.nom = accountXLSX.Nom;
        newAccount.uid = accountXLSX.Login;
        newAccount.password = accountXLSX["Mot de passe"];
        newAccount.email = accountXLSX.Email;
        newAccount.emailIsVerified = accountXLSX["Email verifie"] === 1 ? true : false;
        newAccount.room = accountXLSX.Chambre;
        newAccount.university = accountXLSX.Ecole;
        newAccount.promotion = accountXLSX.Promotion;
        newAccount.cotizT1 = accountXLSX["T1 paye"] === 1 ? true : false;
        newAccount.t1PaymentType = accountXLSX["Moyen de paiement T1"];
        newAccount.t1PaidAt = dateService.stringToDate(accountXLSX["Date paiement T1"]);
        newAccount.cotizT2 = accountXLSX["T2 paye"] === 1 ? true : false;
        newAccount.t2PaymentType = accountXLSX["Moyen de paiement T2"];
        newAccount.t2PaidAt = dateService.stringToDate(accountXLSX["Date paiement T2"]);
        newAccount.cotizT3 = accountXLSX["T3 paye"] === 1 ? true : false;
        newAccount.t3PaymentType = accountXLSX["Moyen de paiement T3"];
        newAccount.t3PaidAt = dateService.stringToDate(accountXLSX["Date paiement T3"]);
        newAccount.createdAt = dateService.stringToDate(accountXLSX["Date de creation"]);
        return newAccount;
      }

      return {
        accountFieldsNameInEnglish : accountFieldsNameInEnglish,
        accountFieldsNameInEnglishWithoutPassword : accountFieldsNameInEnglishWithoutPassword,
        accountFieldsNameInFrench : accountFieldsNameInFrench,
        translateAccountFieldNameInEnglish : translateAccountFieldNameInEnglish,
        translateAccountFieldNameInFrench : translateAccountFieldNameInFrench,
        AccountToXLSXAccount : AccountToXLSXAccount,
        XLSXAccountToAccount : XLSXAccountToAccount,
      }

}