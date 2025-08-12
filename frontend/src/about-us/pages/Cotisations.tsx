
import charte from "../../assets/doc/Charte_VF.pdf";
import statut from "../../assets/doc/status.pdf";
import './../AboutUs.scss'

export default function Cotisations() {

    return <div style={{textAlign : "left"}}>

        <h1>Cotisation</h1>
        <h2>Pourquoi une cotisation ?</h2>
        <p>
            La cotisation est nécessaire pour que l'association soit assez indépendante pour encaisser les frais des abonnements WiFi En effet, le Rezal doit parfois faire face à des équipements défectueux, des remises à niveau des appareils pour assurer la bonne fluidité du réseau. Elle est revue chaque année par le bureau de l'association afin de coller au mieux avec les investissements réalisés et les prévisions de l'année. La cotisation est <b>indispensable pour avoir accès au réseau</b> . Lorsque vous faites un compte, celui-ci est enregistré mais n'a pas encore l'autorisation d'accéder à internet.  <br/>
            C'est après votre cotisation qu'un membre de l'association peut autoriser ce dernier et vous permettre d'autentifier vos appareils. Actuellement, la cotisation se fait sur une durée <b>trimestrielle: 5€/trimestre</b> , selon le découpage suivant :
        </p>
        <p>
            <ul>
                <li>Trimestre 1 : 10 Septembre - 1 Janvier</li>
                <li>Trimestre 2 : 1 Janvier - 1 Avril</li>
                <li>Trimestre 3 : 1 Avril - 15 Juillet</li>
            </ul>

        Lorsque vous avez cotisé pour un trimestre, plus rien à faire!
        </p>
        <h2>Comment cotiser ?</h2>
        <p>
            La cotisation se fait par chèque ou par espèces, directement dans une chambre ou dans une boite aux lettres. Les membres de l'association susceptible d'accepter les cotisations sont:
            <ul>
                <li>Le Président : 21vindry (502)</li>
                <li>Le Trésorier : 21dubois (510)</li>
                <li>Le Secrétaire Général : 21lecorre (214)</li>
            </ul>
        </p>
        <h2>Comment se réforme la cotisation ?</h2>
        <p>
            Si vous avez bien attesté avoir lu et accepté la <a className="link" href={charte} rel="noopener noreferrer" target = "_blank">charte d'utilisation du réseau</a>, vous aurez alors accès au réseau dès que cette personne aura confirmé votre compte ! <br/>
            La cotisation est votée chaque année lors de <b>l'assemblée générale de passation</b> de l'association. C'est après examen d'un bilan moral et financier qu'un vote est réalisé, conformément aux <a className="link" href={statut} rel="noopener noreferrer" target = "_blank">statuts</a> de l'association.
        </p>
    </div>
}
