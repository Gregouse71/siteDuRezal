import { faFileExcel, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { useAdminService } from "../../../services/admin.service";
import useCSVService from "../../../services/csv.service";
import usePopupService from "../../../services/popup.service";
import "./ListRadiusUsers.scss";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import httpInstance from "../../../services/api";

function SessionsPopup({ user, open, onClose }) {
    const queryclient = useQueryClient();
    const popupService = usePopupService();
    const { getRadiusSessions } = useAdminService();
    const {
        data: sessions,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["sessionsRadius", user],
        queryFn: () => getRadiusSessions(user),
        enabled: open && Boolean(user),
    });

    const handelDelSessions = async (del) => {
        await httpInstance
            .delete(`radius/sessions/${user}/${del}`)
            .then((response) => {
                switch (response.data) {
                    case "Success":
                        popupService.changePopup({
                            status: "success",
                            message: del ? "Session supprimées." : "Session fermées.",
                        });
                        break;
                    default:
                        popupService.changePopup({
                            status: "error",
                            message: "Echec.",
                        });
                        break;
                }
            })
            .catch((_error) => {
                popupService.changePopup({
                    status: "error",
                    message: "Erreur serveur : impossible d'effacer les données.",
                });
            });
        queryclient.invalidateQueries(["sessionsRadius", user]);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Sessions de {user}</DialogTitle>
            <DialogContent dividers>
                {isLoading && <div>Chargement...</div>}
                {isError && <Typography color="error">Erreur lors du chargement des sessions.</Typography>}
                {!isLoading && !isError && (!sessions || sessions.length === 0) && (
                    <Typography color="text.secondary">Aucune session trouvée.</Typography>
                )}
                {!isLoading && !isError && sessions && sessions.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {sessions.map((elt, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    backgroundColor: !elt.acctstoptime ? "#ff9900" : "#f5f5f5",
                                    border: "1px solid #e0e0e0",
                                }}
                            >
                                <div>
                                    {new Date(elt.acctstarttime).toLocaleString("fr-fr")} -{" "}
                                    {elt.acctstoptime ? new Date(elt.acctstoptime).toLocaleString("fr-fr") : "en cours"}{" "}
                                    {elt.callingstationid && <>({elt.callingstationid})</>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" onClick={() => handelDelSessions(true)}>
                    Effacer tout
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => handelDelSessions(false)}>
                    Fermer ouvertes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ListRadiusUsers() {
    const adminService = useAdminService();
    const popupService = usePopupService();
    const CSVService = useCSVService();

    const [stringFilter, setStringFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const {
        data: loginsInRadius,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["loginsInRadius"],
        queryFn: adminService.getRadiusUsers,
    });

    const uploadRadiusUsersListAsCSV = () => {
        const lines = loginsInRadius.map((login) => {
            return { Login: login };
        });

        CSVService.exportAsCSV(lines, "Logins in radius");
    };

    if (isLoading) return <>Chargement...</>;
    if (isError) {
        popupService.changePopup({ status: "error", message: "Erreur de la requête" });
        return <>Erreur...</>;
    }

    return (
        <div className="radius-users">
            <div className="option-radius-users">
                <span> Filtrer les nom d'utilisateur : </span>
                <input
                    type="text"
                    value={stringFilter}
                    onChange={(event) => setStringFilter(event.target.value)}
                    onBlur={(event) => setStringFilter(event.target.value)}
                />
            </div>

            <div className="liste-radius-users">
                {loginsInRadius
                    .filter((login) => login.includes(stringFilter))
                    .map((login) => (
                        <div className="radius-user-item" key={login} onClick={() => setSelectedUser(login)}>
                            {login}
                        </div>
                    ))}
            </div>

            <SessionsPopup user={selectedUser} open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} />

            <div style={{ textAlign: "center" }}>
                <Button
                    variant="outlined"
                    color="success"
                    onClick={() => uploadRadiusUsersListAsCSV()}
                    style={{ margin: "2vh auto" }}
                >
                    Télécharger la liste des comptes {stringFilter !== "" && "(non filtrée)"}
                    <FontAwesomeIcon icon={faFileExcel} size="2x" style={{ marginLeft: "1vw" }} />
                    <FontAwesomeIcon icon={faUpload} size="2x" style={{ marginLeft: "1vw" }} />
                </Button>
            </div>
        </div>
    );
}
