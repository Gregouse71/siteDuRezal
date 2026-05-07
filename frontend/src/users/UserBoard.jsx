import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthService } from "../services/auth.service"
import { useDateService } from "../services/date.service";
import { useAdminService } from "../services/admin.service";
import { Account } from "../models/account";
import usePopupService from "../services/popup.service";
import httpInstance from "../services/api";
import './Users.scss'

export default function UserBoard() {
    const { user, setUser } = useAuthService();
    const dateService = useDateService();
    const popupService = usePopupService();

    const cotiser = (trimestre) => {
        httpInstance.post('wifi/cotiser', trimestre)
            .then((response) => {
                popupService.changePopup({ status: "success", message: "Crédits ajoutés pour le T1" })
                setUser(new Account(response.data))
            })
            .catch(error => {
                const errorStatus = error.response.status;
                switch (errorStatus) {
                    case 400: {
                        popupService.changePopup({ status: "error", message: "Pas assez de crédits" });
                        break;
                    }
                    default: popupService.changePopup({ status: "error", message: "Erreur inconnue" })
                }
            });
    }

    const crediter = [
        [() => cotiser({ T1: true }), user.cotizT1],
        [() => cotiser({ T2: true }), user.cotizT2],
        [() => cotiser({ T3: true }), user.cotizT3],
    ]
    console.log(crediter)

    return <>
        <div className="user-board-container">
            <div className="welcome-section">
                <h1>Mon compte : {user.prenom} {user.nom}</h1>
                <div>Voici un récapitulatif de tes informations et de tes cotisations.</div>
            </div>

            <div className="board-columns-container">
                <div className="user-info-card">
                    <p className="title-part">Informations générales</p>

                    <div id="container-table">
                        <table className="table table-centered">
                            <tbody>
                                <tr>
                                    <td>Accès au réseau</td>
                                    <td>
                                        <b style={{ color: user.acces_wifi ? 'green' : 'red' }}>{user.acces_wifi ? "Autorisé" : "Non autorisé"}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Crédits</td>
                                    <td>{user.credits ? user.credits : "0"}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td><div className="overflow-handler">{user.email}</div></td>
                                </tr>
                                <tr>
                                    <td>Identifiant</td>
                                    <td><div className="overflow-handler">{user.uid}</div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="cotisations-card">
                    <p className="title-part">Récapitulatif cotisations</p>

                    <div className="list-group">
                        <table className="table table-centered">
                            <tbody>
                                {crediter.map(([cotiz, deja], ind) =>
                                    <tr key={ind} className='list-group-item'>
                                        <td className="cotisation-info">
                                            <div>T{ind + 1}</div>
                                            <small>{dateService.dateTrimester(ind + 1)}</small>
                                        </td>
                                        <td className="cotisation-status">
                                            {deja ?
                                                <div className="status-yes">Oui</div> :
                                                <>
                                                    <div className="status-no">Non</div>
                                                    <button className="cotisation-activate-btn" onClick={cotiz} disabled={user.credits < 1}>Activer</button>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="guidance-section">
                <p>Tu as un appareil Apple ? Tu n'arrives pas à te connecter ? <Link className="guidance-link" to="/about-us" replace>Comment se connecter ?</Link>
                </p>
                <p>
                    Comment cotiser ? Rends toi vite sur <Link
                        className="guidance-link" to="https://www.helloasso.com/associations/rezal/adhesions/cotisations-rezal-25-26"
                        target="_blank" // Open in new tab
                        rel="noopener noreferrer" // Security best practice
                        replace>HelloAsso
                    </Link>. Penses bien à indiquer le même mail pour le paiement sur HelloAsso.
                </p>
                <div>
                    Si tu as des questions, n'hésite pas à nous contacter avec l'adresse <a href="mailto:admin@rezal-mdm.com">admin@rezal-mdm.com</a> ! <br />
                    S'il s'agit d'un problème de connexion, vérifie qu'il y a bien écrit Accés au réseau "autorisé" en haut de cette page (si ce n'est pas le cas il faut peut-être que tu actives tes crédits) et que tu utilises les bons identifiants/mot de passe (les même que pour ce site). S'il y a bien un problème, n'hésite pas à nous écrire, en spécifiant le type d'appareil qui a des problème, tout message d'erreur qui pourrait être utile, et la chambre dans laquelle tu résides.
                </div>
            </div>

        </div>
    </>
}