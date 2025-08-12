import { useRecoilValue } from "recoil";
import { useAdminService } from "../services/admin.service";
import { universities, paymentTypes, promotions } from "../assets/lists";
import { useEffect } from "react";

export default function AccountsSyntesis() {

    const adminService = useAdminService();
    const accounts = Array.from(useRecoilValue(adminService.databaseAccountsState));

    useEffect(() => {
        adminService.updateDatabaseView()
    }, [])

    const TrimesterRow = (props : any) => {
        const trimesterNum = props.trimesterNum.toString();
        const accountThatHavePaid = accounts
                                        .map(IdAndAccount => IdAndAccount[1])
                                        .filter(accountData => accountData.get("t" + trimesterNum + "Paid"))

        const accountsThatHavePaidAndAreMineurs = accountThatHavePaid.filter(account => account.university === "Mines")

        return <tr>

            <td> {"T" +  trimesterNum} </td>
            <td> {accountThatHavePaid.length} </td>
            {promotions
                .map(promo => <td key={"promotion td " + promo}>{accountsThatHavePaidAndAreMineurs
                    .filter(account => account.promotion === promo)
                    .length}
                </td>)
            }
            <td> {accountsThatHavePaidAndAreMineurs.length} </td>   
            {universities
                .filter(university => university !== "Mines")
                .map(university => <td key={"university td " + university}>
                    {accountThatHavePaid
                        .filter(account => account.university === university)
                        .length
                    }
                </td>)
            }
            {paymentTypes
                .map(type => <td key={"paymentTypes td " + type}>
                    {accountThatHavePaid
                        .filter(account => account.get("t" + trimesterNum + "PaymentType") === type)
                        .length
                    }
                </td>)
            }
        </tr>

    }

    return <table className="table table-bordered table-striped table-sm" style={{textAlign : "center", margin : "auto", width : "80%"}}>
        <thead className="align-middle">
            <tr>
                <th scope="col" rowSpan={3}> Période</th>
                <th scope="col" rowSpan={3}> Nombre cotisants</th>
                <th scope="col" colSpan={universities.length + promotions.length}> Ecole</th>
                <th scope="col" colSpan={paymentTypes.length}> Mode de paiement </th>
            </tr>
            <tr>
                <th scope="col" colSpan={promotions.length + 1} > Mines </th>
                {universities
                    .filter(university => university !== "Mines")
                    .map(university => <th key={"university th " + university} rowSpan={2}>{university}</th>)}
                {paymentTypes.map(type => <th key={"paymentTypes th " + type} rowSpan={2}>{type}</th>)}
            </tr>
            <tr>
                {promotions.map(promo => <th key={"promo th " + promo}>{promo}</th>)}
                <th> Total Mines</th>
            </tr>
        </thead>
        <tbody className="align-middle">
                {[1, 2, 3].map(num => <TrimesterRow key={"TrimesterRow " + num} trimesterNum={num}/>)}
        </tbody>
    </table>

}
