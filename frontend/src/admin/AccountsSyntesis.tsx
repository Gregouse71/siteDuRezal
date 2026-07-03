import { useRecoilValue } from "recoil";
import { useAdminService } from "../services/admin.service";
import { paymentTypes, promotions } from "../assets/lists";
import { useEffect } from "react";

export default function AccountsSyntesis() {
    const adminService = useAdminService();
    const accounts = Array.from(useRecoilValue(adminService.databaseAccountsState));

    useEffect(() => {
        adminService.updateDatabaseView();
    }, []);

    const TrimesterRow = (props: { trimesterNum: number }) => {
        const trimesterNum = props.trimesterNum.toString();
        const accountThatHavePaid = accounts
            .map((IdAndAccount) => IdAndAccount[1])
            .filter((accountData) => accountData.get("cotizT" + trimesterNum));

        const accountsThatHavePaidAndAreMineurs = accountThatHavePaid.filter((account) => account.promotion !== "XX");

        return (
            <tr>
                <td> {"T" + trimesterNum} </td>
                <td> {accountThatHavePaid.length} </td>
                {promotions.map((promo) => (
                    <td key={"promotion td " + promo}>
                        {accountsThatHavePaidAndAreMineurs.filter((account) => account.promotion === promo).length}
                    </td>
                ))}
                <td> {accountsThatHavePaidAndAreMineurs.length} </td>
                {paymentTypes.map((type) => (
                    <td key={"paymentTypes td " + type}>
                        {
                            accountThatHavePaid.filter(
                                (account) => account.get("t" + trimesterNum + "PaymentType") === type,
                            ).length
                        }
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <table
            className="table table-bordered table-striped table-sm"
            style={{ textAlign: "center", width: "80%", margin: 0 }}
        >
            <thead className="align-middle">
                <tr>
                    <th scope="col" rowSpan={3}>
                        {" "}
                        Période
                    </th>
                    <th scope="col" rowSpan={3}>
                        {" "}
                        Nombre cotisants
                    </th>
                    <th scope="col" rowSpan={2}></th>
                    <th scope="col" colSpan={promotions.length} rowSpan={2}>
                        {" "}
                        Mines
                    </th>
                    <th scope="col" colSpan={paymentTypes.length}>
                        {" "}
                        Mode de paiement{" "}
                    </th>
                </tr>
                <tr>
                    {paymentTypes.map((type) => (
                        <th key={"paymentTypes th " + type} rowSpan={2}>
                            {type}
                        </th>
                    ))}
                </tr>
                <tr>
                    {promotions.map((promo) => (
                        <th key={"promotion th " + promo}>{promo}</th>
                    ))}
                    <th> Total Mines</th>
                </tr>
            </thead>
            <tbody className="align-middle">
                {[1, 2, 3].map((num) => (
                    <TrimesterRow key={"TrimesterRow " + num} trimesterNum={num} />
                ))}
            </tbody>
        </table>
    );
}
