import { Link } from "react-router-dom";
import { useAuthService } from "../services/auth.service"
import { useDateService } from "../services/date.service";
import './Users.scss'

export default function UserBoard() {

    const user = useAuthService().user;
    const dateService = useDateService();

    return <>
    <div>
        <h2 className="title-page"> Ton compte </h2>
        <div id="user-board">
            <h1>{user.login}</h1>
    
            <p className="title-part"> Informations générales </p>
    
            <div id="container-table">
                <table className="table table-bordered table-centered">
                    <tbody>
                        <tr>
                            <th>Accès au réseau</th>
                            <td style={{backgroundColor : user.isInRadius ? 'green' : 'red'}}>
                                <b style={{color : "white"}}>{user.isInRadius ? "Autorisé":"Non autorisé"}</b>
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{user.email}</td>
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
                    <li className={user.t1Paid ? 'list-group-item-success' : 'list-group-item-danger'}>
                        T1 : {user.t1Paid ? "Oui" : "Non"} <br/>
                        {dateService.dateTrimester(1)}
                    </li>
                    <li className={user.t2Paid ? 'list-group-item-success' : 'list-group-item-danger'}>
                        T2 : {user.t2Paid ? "Oui" : "Non"}  <br/>
                        {dateService.dateTrimester(2)}
                    </li>
                    <li className={user.t3Paid ? 'list-group-item-success' : 'list-group-item-danger'}>
                        T3 : {user.t3Paid ? "Oui" : "Non"}  <br/>
                        {dateService.dateTrimester(3)}
                    </li>
                </ul>

                <p></p>

                <p> 
                    Comment cotiser ? Toutes les infos 
                    <Link style={{color : "blue", marginLeft : "3px"}} to="/about-us" replace>ici</Link>
                </p>   
                <div> Si tu as des questions, n'hésite pas à nous contacter avec l'adresse <u>admin@rezal-mdm.com</u> ! </div> 
        

            </div>
    
        </div>
    </div>
    </>}