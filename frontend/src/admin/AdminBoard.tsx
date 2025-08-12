import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import AccountsSyntesis from "./AccountsSyntesis"
import "./Admin.scss"

export default function AdminBoard(props : any) {

    const FeatureButtons = props?.featuresDefinition.map(
        (feature : any) => <Link key={feature.name + " lien"} to={"/admin/" + feature.routeName} style={{ textDecoration: 'none' }}> 
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
    </>)
}