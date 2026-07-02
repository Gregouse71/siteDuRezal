import toNumber from "lodash/toNumber";
import { promotions, paymentTypes } from "../assets/lists";

export class AccountXLSX {
    "#": number;
    "Acces a internet": number;
    Admin: number;
    Prenom: string;
    Nom: string;
    Login: string;
    "Mot de passe": string;
    Email: string;
    "Email verifie": number;
    Credits: number;
    Chambre: string;
    Promotion: string;
    "T1 paye": number; // Format : dd/mm/yyyy
    "Moyen de paiement T1": string;
    "Date paiement T1": string;
    "T2 paye": number; // Format : dd/mm/yyyy
    "Moyen de paiement T2": string;
    "Date paiement T2": string;
    "T3 paye": number; // Format : dd/mm/yyyy
    "Moyen de paiement T3": string;
    "Date paiement T3": string; // Format : dd/mm/yyyy
    "Date de creation": string; // Format : dd/mm/yyyy

    constructor(data: any) {
        // Data comes from an excel sheet, every value is a string in the data object
        this["#"] = data["#"] !== undefined ? toNumber(data["#"]) : -1;
        this["Acces a internet"] = data["Acces a internet"] !== undefined ? toNumber(data["Acces a internet"]) : 0;
        this.Admin = data.Admin !== undefined ? toNumber(data.Admin) : 0;
        this.Prenom = data.Prenom !== undefined ? data.Prenom : "";
        this.Nom = data.Nom !== undefined ? data.Nom : "";
        this.Login = data.Login !== undefined ? data.Login : "";
        this["Mot de passe"] = data["Mot de passe"] !== undefined ? data["Mot de passe"] : "";
        this.Email = data.Email !== undefined ? data.Email : "";
        this["Email verifie"] = data["Email verifie"] !== undefined ? toNumber(data["Email verifie"]) : 0;
        this.Credits = data.Credits !== undefined ? toNumber(data.Credits) : 0;
        this.Chambre = data.Chambre !== undefined ? data.Chambre : "";
        this.Promotion =
            data.Promotion !== undefined
                ? promotions.includes(data.Promotion)
                    ? data.Promotion
                    : promotions[0]
                : promotions[0];
        this["Moyen de paiement T1"] =
            data["Moyen de paiement T1"] !== undefined
                ? paymentTypes.includes(data["Moyen de paiement T1"])
                    ? data["Moyen de paiement T1"]
                    : paymentTypes[0]
                : paymentTypes[0];
        this["T1 paye"] = data["T1 paye"] !== undefined ? toNumber(data["T1 paye"]) : 0;
        this["Date paiement T1"] = data["Date paiement T1"] !== undefined ? data["Date paiement T1"] : "";
        this["T2 paye"] = data["T2 paye"] !== undefined ? toNumber(data["T2 paye"]) : 0;
        this["Moyen de paiement T2"] =
            data["Moyen de paiement T2"] !== undefined
                ? paymentTypes.includes(data["Moyen de paiement T2"])
                    ? data["Moyen de paiement T2"]
                    : paymentTypes[0]
                : paymentTypes[0];
        this["Date paiement T2"] = data["Date paiement T2"] !== undefined ? data["Date paiement T2"] : "";
        this["T3 paye"] = data["T3 paye"] !== undefined ? toNumber(data["T3 paye"]) : 0;
        this["Moyen de paiement T3"] =
            data["Moyen de paiement T3"] !== undefined
                ? paymentTypes.includes(data["Moyen de paiement T3"])
                    ? data["Moyen de paiement T3"]
                    : paymentTypes[0]
                : paymentTypes[0];
        this["Date paiement T3"] = data["Date paiement T3"] !== undefined ? data["Date paiement T3"] : "";
        this["Date de creation"] = data["Date de creation"] !== undefined ? data["Date de creation"] : "";
    }
}
