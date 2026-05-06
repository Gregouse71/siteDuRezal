import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import AccountsSyntesis from "./AccountsSyntesis"
import "./Admin.scss"

export default function AdminBoard(props: any) {

    const FeatureButtons = props?.featuresDefinition.map(
        (feature: any) => <Link key={feature.name + " lien"} to={"/admin/" + feature.routeName} style={{ textDecoration: 'none' }}>
            <Button variant="outlined" id="btn-feature">
                <h2 className="title-feature"> {feature.name} </h2>
                <p className="description-feature"> {feature.description} </p>
            </Button>
        </Link>
    )

    return (<>
        <h2 className="titre-page-admin"> Fonctionnalités </h2>

        <div className="container-features">
            {FeatureButtons}
        </div>

        <h2> Synthèse des comptes </h2>
        <AccountsSyntesis />
        <h2 className="titre-page-admin">Liens utiles</h2>
        <ul>
            <li>Zeus (routeur pfSense principal) : <a href="https://10.100.0.251:1337">https://10.100.0.251:1337</a></li>
            <li>Hades (routeur pfSense de secours) : <a href="https://10.100.0.252:1337">https://10.100.0.252:1337</a></li>
            <li>PVE (nouveau serveur) : <a href="https://10.100.1.56:8006">https://10.100.1.56:8006</a></li>
            <li>PVE2 (ancien serveur) : <a href="https://10.100.1.57:8006">https://10.100.1.57:8006</a></li>
            <li>Nuclias (gestion des bornes) : <a href="https://10.100.1.74:30001">https://10.100.1.74:30001</a></li>
            <li>Grafana (monitoring, uniquement de l'intérieur) : <a href="https://clio.rezal-mdm.com/grafana">https://clio.rezal-mdm.com/grafana</a></li>
            <li>Doc (pas à jour, uniquement de l'intérieur) : <a href="https://clio.rezal-mdm.com/doc">https://clio.rezal-mdm.com/doc</a></li>
        </ul>
    </>)
}