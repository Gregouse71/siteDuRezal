import { faDownload, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { AccountXLSX } from "../../../models/accountXLSX";
import useConversionService from "../../../services/conversion.service";
import useCSVService from "../../../services/csv.service";
import usePopupService from "../../../services/popup.service";

export default function UsersCSV(props: any) {
    const conversionService = useConversionService();
    const popupService = usePopupService();
    const excelService = useCSVService();

    const [currentAccounts, setCurrentsAccounts] = useState(props.currentAccounts);

    useEffect(() => {
        setCurrentsAccounts(props.currentAccounts);
    }, [props.currentAccounts]);

    const downloadCSVUSers = (event: any) => {
        excelService
            .importCSVToList(event)
            .then((list) => {
                list.map((accountData: any) => conversionService.XLSXAccountToAccount(new AccountXLSX(accountData)))
                    .filter((accountXLSX) => accountXLSX.id && currentAccounts.get(accountXLSX.id) !== undefined)
                    .forEach((AccountXLSX) => currentAccounts.set(AccountXLSX.id, AccountXLSX));
                props.setCurrentAccouts(new Map(currentAccounts));
                popupService.changePopup({ status: "success", message: "Import réussie" });
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
        <div
            style={{
                textAlign: "center",
                margin: "1vw",
                display: "flex",
                justifyContent: "space-around",
                overflowX: "auto",
            }}
        >
            <button className="btn btn-outline-success">
                <input type="file" accept=".csv,.xlsx,.xls" onChange={downloadCSVUSers} />
                Uploader les comptes
                <FontAwesomeIcon icon={faFileExcel} size="2x" style={{ margin: "0 1vw 0 1vw" }} />
                <FontAwesomeIcon icon={faDownload} size="2x" style={{ margin: "0 1vw 0 1vw" }} />
            </button>
        </div>
    );
}
