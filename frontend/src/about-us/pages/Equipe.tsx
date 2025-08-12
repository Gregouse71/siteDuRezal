import charte from "../../assets/doc/Charte_VF.pdf";
import './../AboutUs.scss'

export default function Equipe() {


    return <div style={{textAlign : "left"}}>

        <h1>Equipe</h1>
        <p>
            Cette année, nous sommes 4 personnes au Rézal. L'association, selon nos status actuels, est dirigée par un bureau restreint constitué de 3 personnes, ainsi que de membres d'un conseil d'administration, constitué des autres personnes de l'association. Les cotisants ont eu un statut de <i>simple membre</i>, ce qui leur permet de prendre part à l'assemblée générale de passation et à ses votes.
        </p>
        <h2>Le bureau restreint</h2>
        <p>
            Ce bureau est constitué par :
            <ul>
                <li>Un.e Président.e : actuellement Guillaume VINDRY (502)</li>
                <li>Un.e Trésorier.e : actuellement Camille DUBOIS (510)</li>
                <li>Un.e Secrétaire Général.e : actuellement Augustin LE CORRE (214)</li>
            </ul>
        </p>
        <h2>Conseil d'administration</h2>
        <p>
            Le conseil d'administration est actuellement constitué de 4 personnes (par ordre alphabétique):
            <ul>
                <li>Camille Dubois (Trésorier)</li>
                <li>Augustin Le Corre(SecGen)</li>
                <li>Martin Stoll</li>
                <li>Guillaume Vindry(Président)</li>
            </ul>
        </p>
        <h2>Simples membres</h2>
        <p>
            Pour devenir simple membre de l'association, il faut avoir créé un compte sur ce site, avoir lu et accepté la <a className="link" href={charte} rel="noreferrer" target = "_blank">charte d'utilisation du réseau</a> et avoir cotisé durant au moins un trimestre dans l'année!
        </p>
    </div>
}
