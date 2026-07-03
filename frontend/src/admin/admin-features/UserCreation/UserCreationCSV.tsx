import { faFileExcel, faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useCSVService from "../../../services/csv.service";
import { AccountXLSX } from "../../../models/accountXLSX";
import { Button } from "@mui/material";
import usePopupService from "../../../services/popup.service";
import useConversionService from "../../../services/conversion.service";
import { useDateService } from "../../../services/date.service";
import { promotions, paymentTypes } from "../../../assets/lists";

export default function UserCreationExcel(props: any) {
    const conversionService = useConversionService();
    const popupService = usePopupService();
    const dateService = useDateService();
    const CSVService = useCSVService();

    const uploadExcelTemplate = () => {
        const exampleLine = {
            "Acces a internet": "1/0",
            Admin: "1/0",
            Prenom: "",
            Nom: "",
            Login: "",
            "Mot de passe": "",
            Email: "",
            Chambre: "",
            Promotion: promotions.reduce((output, promotion, index) =>
                index === 0 ? promotion : output + "|" + promotion,
            ),
            "T1 paye": "1/0",
            "Moyen de paiement T1": paymentTypes.reduce((output, paymentType, index) =>
                index === 0 ? paymentType : output + "|" + paymentType,
            ),
            "Date paiement T1": "dd/mm/yyyy",
            "T2 paye": "Comme T1",
            "Moyen de paiement T2": "",
            "Date paiement T2": "",
            "T3 paye": "Comme T1",
            "Moyen de paiement T3": "",
            "Date paiement T3": "",
        };

        CSVService.exportAsCSV([exampleLine], "template creation de comptes");
    };

    const downloadExcelNewUSers = (event: any) => {
        CSVService.importCSVToList(event)
            .then((list) => {
                const newUsers = list
                    .map((accountData: any) =>
                        conversionService.XLSXAccountToAccount(
                            new AccountXLSX({
                                ...accountData,
                                "Email verifie": 1,
                                "Date de creation": accountData["Date de creation"]
                                    ? accountData["Date de creation"]
                                    : dateService.dateToString(new Date()),
                            }),
                        ),
                    )
                    .filter((account) => account.password !== null);
                props.setComputedUsersFromCSV(newUsers);
            })
            .catch((error) => {
                const errorStatus = error.request.status;
                switch (errorStatus) {
                    case 404: {
                        popupService.changePopup({ status: "error", message: "Erreur de la requête" });
                        break;
                    }
                    default:
                        popupService.changePopup({ status: "error", message: "Erreur inconnue" });
                }
            });
    };

    return (
        <>
            <Button variant="outlined" color="success" onClick={() => uploadExcelTemplate()}>
                Télécharger le template de création de comptes
                <FontAwesomeIcon icon={faFileExcel} size="2x" style={{ marginLeft: "1vw" }} />
                <FontAwesomeIcon icon={faUpload} size="2x" style={{ marginLeft: "1vw" }} />
            </Button>
            <Button variant="outlined" color="success">
                <input type="file" accept=".csv,.xlsx,.xls" onChange={downloadExcelNewUSers} />
                Uploader de nouveaux comptes
                <FontAwesomeIcon icon={faFileExcel} size="2x" style={{ marginLeft: "1vw" }} />
                <FontAwesomeIcon icon={faDownload} size="2x" style={{ marginLeft: "1vw" }} />
            </Button>
        </>
    );
}
