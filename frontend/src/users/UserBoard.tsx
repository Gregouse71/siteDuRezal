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
    const modifyAccount = useAdminService().modifyAccounts;
    const { user, setUser } = useAuthService();
    const dateService = useDateService();
    const popupService = usePopupService();
    let update = true;
    const [cotT1, setCotT1] = useState(user.cotizT1);

    const cotiser = (trimestre: any) => {
        httpInstance.post('wifi/cotiser', trimestre)
            .then((response: any) => {
                popupService.changePopup({ status: "success", message: "Crédits ajoutés pour le T1" })
                console.log(response);
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

    const crediterT1 = () => { cotiser({ T1: true }) }
    const crediterT2 = () => { cotiser({ T2: true }) }
    const crediterT3 = () => { cotiser({ T3: true }) }

    return <>
        <div>
            <h2 className="title-page"> Ton compte </h2>
            <div id="user-board">
                <h1>{user.prenom + " " + user.nom}</h1>

                <p className="title-part"> Informations générales </p>

                <div id="container-table">
                    <table className="table table-bordered table-centered">
                        <tbody>
                            <tr>
                                <th>Accès au réseau</th>
                                <td style={{ backgroundColor: user.acces_wifi ? 'green' : 'red' }}>
                                    <b style={{ color: "white" }}>{user.acces_wifi ? "Autorisé" : "Non autorisé"}</b>
                                </td>
                            </tr>
                            <tr>
                                <th>Crédits</th>
                                <td>{user.credits ? user.credits : "0"}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <th>login</th>
                                <td>{user.uid}</td>
                            </tr>
                            <tr>
                                <th>Date création</th>
                                <td>{dateService.dateToString(user.createdAt)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="title-part"> Récapitulatif cotisations </p>

                <div>
                    <ul className="list-group">
                        <li className="list-group-item" > Cotisations </li>
                        <li className={user.cotizT1 ? 'list-group-item-success' : 'list-group-item-danger'}>
                            T1 :
                            {user.cotizT1 ?
                                <span style={{ color: "green" }}>Oui</span> :
                                <><span style={{ color: "red" }}>Non</span><button onClick={crediterT1}>Activer</button></>}
                            <br />
                            {dateService.dateTrimester(1)}
                        </li>
                        <li className={user.cotizT2 ? 'list-group-item-success' : 'list-group-item-danger'}>
                            T2 :
                            {user.cotizT2 ?
                                <span style={{ color: "green" }}>Oui</span> :
                                <><span style={{ color: "red" }}>Non</span><button onClick={crediterT2}>Activer</button></>}
                            <br />
                            {dateService.dateTrimester(2)}
                        </li>
                        <li className={user.cotizT3 ? 'list-group-item-success' : 'list-group-item-danger'}>
                            T3 :
                            {user.cotizT3 ?
                                <span style={{ color: "green" }}>Oui</span> :
                                <><span style={{ color: "red" }}>Non</span><button onClick={crediterT3}>Activer</button></>}
                            <br />
                            {dateService.dateTrimester(3)}
                        </li>
                    </ul>

                    <p></p>
                    <p>Tu as un appareil Apple ? Tu n'arrives pas à te connecter ? Si tu es sûr de rentrer les bons identifiants :
                        <Link
                            style={{ color: "orange", marginLeft: "3px" }}
                            to="/about-us"
                            replace>Comment se connecter ?
                        </Link>
                    </p>
                    <p>
                        Comment cotiser ? Rends toi vite sur
                        <Link
                            style={{ color: "blue", marginLeft: "3px" }}
                            to="https://www.helloasso.com/associations/rezal/adhesions/cotisations-rezal-25-26"
                            replace>HelloAsso
                        </Link>. Penses bien à indiquer le même mail pour le paiement sur HelloAsso.
                    </p>
                    <div> Si tu as des questions, n'hésite pas à nous contacter avec l'adresse <u>admin@rezal-mdm.com</u> ! <br/>
                    S'il s'agit d'un problème de connexion, vérifie qu'il y a bien écrit Accés au réseau "autorisé" en haut de cette page (si ce n'est pas le cas il faut peut-être que tu actives tes crédits) et que tu utilises les bons identifiants/mot de passe (les même que pour ce site). S'il y a bien un problème, n'hésite pas à nous écrire, en spécifiant le type d'appareil qui a des problème, tout message d'erreur qui pourrait être utile, et la chambre dans laquelle tu résides. </div>


                </div>

            </div>
        </div>
    </>
}