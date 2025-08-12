import { faFileExcel, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useAdminService } from "../../../services/admin.service"
import useCSVService from "../../../services/csv.service";
import usePopupService from "../../../services/popup.service";
import './ListRadiusUsers.scss'


export default function ListRadiusUsers() {

    const adminService = useAdminService();
    const popupService = usePopupService();
    const CSVService = useCSVService();
    
    const [loginsInRadius, setLoginsInRadius] = useState<Array<string>>([]);
    const [columnsNum, setColumnsNum] = useState(5);
    const [stringFilter, setStringFilter] = useState("");

    useEffect(() => {
        getRadiusUsers();
    }, [])

    const getRadiusUsers = () => {
        adminService.getRadiusUsers()
        .then(loginsRadius => {
            setLoginsInRadius(loginsRadius);
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
        })
    }

    const uploadRadiusUsersListAsCSV = () => {
        const lines = loginsInRadius.map(
            login => {
                return {"Login" : login}
            }
        );

        CSVService.exportAsCSV(lines, "Logins in radius");
    }

    return <>
        <div className="option-radius-users">
            <span> Changer le nombre de colonnes </span> 
            <input 
                type="number"
                min="1"
                value={columnsNum}
                onChange={(event) => setColumnsNum(Number(event.target.value))}
                onBlur={(event) => setColumnsNum(Number(event.target.value))}
            />
        </div>

        <div className="option-radius-users">
            <span> Ne montrer que les logins contenant la chaine : </span> 
            <input 
                type="text"
                value={stringFilter}
                onChange={(event) => setStringFilter(event.target.value)}
                onBlur={(event) => setStringFilter(event.target.value)}
            />
        </div>

        <div style={{columns : columnsNum + " auto", columnGap : "0px"}}>
            {loginsInRadius
            .filter(login => login.includes(stringFilter))
            .map(login => <div style={{border : "1px solid black", textAlign : "center", padding : "2px"}}>
                    {login}
            </div>)}
        </div>

        <div style={{textAlign : "center"}}>
            <Button 
                variant = "outlined"
                color = "success"
                onClick={() => uploadRadiusUsersListAsCSV()}
                style={{margin : "2vh auto"}}
            > 
                    Télécharger la liste des comptes {stringFilter !== "" && "(non filtrée)"}
                <FontAwesomeIcon icon={faFileExcel} size="2x" style={{marginLeft : "1vw"}} />  
                <FontAwesomeIcon icon={faUpload} size="2x" style={{marginLeft : "1vw"}} />  
            </Button>    
        </div>
    </>
}