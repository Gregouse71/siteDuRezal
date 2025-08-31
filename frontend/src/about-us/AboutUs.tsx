
import { Routes, Route, Link } from 'react-router-dom';
import "./AboutUs.scss"

import charte from "../assets/doc/Charte_VF.pdf";
import statut from "../assets/doc/status.pdf";

export function AboutUs() {
    return <div id="container-about-us" style={{textAlign : "left"}}>
        <div>
            <h2>Le Rézal</h2>
            <p>Le Rézal est l'association chargée de l'exploitation du réseau informatique de la Maison des Mines et des Ponts, par délégation de la direction.</p>
        </div>
        <div>
            <h2>Se connecter au réseau</h2>
            <p>
                Le nom du réseau pour les cotisants est <b>Rezal</b>. 
                Il suffit d'entrer un login et un mot de passe et s'ils correspondent à un compte approuvé par l'association alors l'accès est confirmé et l'appareil a accès à internet.
            </p>
            <h3>Certificat</h3>
            <p>Parfois, l'appareil peut demander un <b>certificat</b> d'authentification, qui n'est pas obligatoire, il est donc recommander d'indiquer <b>pas de certificat</b> lors de la connexion.</p>
        </div>
        <div>
            <h2>Equipe</h2>
            <p>
                Cette année, nous sommes 4 personnes au Rézal. L'association, selon nos status actuels, est dirigée par un bureau restreint constitué de 3 personnes, ainsi que de membres d'un conseil d'administration, constitué des autres personnes de l'association. Les cotisants ont eu un statut de <i>simple membre</i>, ce qui leur permet de prendre part à l'assemblée générale de passation et à ses votes.
            </p>
            <h3>Le bureau restreint</h3>
            <p>
                Ce bureau est constitué de :
                <ul>
                    <li>Un Président : actuellement Grégoire Girardet (518)</li>
                    <li>Un Trésorier : actuellement Adrien Martinez</li>
                    <li>Un Secrétaire Général : actuellement Mathis Liens</li>
                </ul>
            </p>
            <h3>Conseil d'administration</h3>
            <p>
                Le conseil d'administration est actuellement constitué de 4 personnes (par ordre alphabétique):
                <ul>
                    <li>Adrien Martinez (Trésorier)</li>
                    <li>Mathis Liens (SecGen)</li>
                    <li>Yanis Baron</li>
                    <li>Grégoire Girardet (Président)</li>
                </ul>
            </p>
            <h3>Simples membres</h3>
            <p>
                Pour devenir simple membre de l'association, il faut avoir créé un compte sur ce site, avoir lu et accepté la <a className="link" href={charte} rel="noreferrer" target = "_blank">charte d'utilisation du réseau</a> et avoir cotisé durant au moins un trimestre dans l'année !
            </p>
            <h2>Contact</h2>
            <p>
                Les membres de l'association sont disponibles via une adresse email d'administration : <i>admin@rezal-mdm.com</i>. Nous vous répondrons dans les meilleurs délais.
                Vous pouvez aussi nous contacter de manière plus informelle, chaque membre est alors libre de sa décision de vous répondre ou non !
            </p>
        </div>
        <div>
            <h2>Cotisation</h2>
            <h3>Pourquoi une cotisation ?</h3>
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
            <h3>Comment cotiser ?</h3>
            <p>
                La cotisation se fait par paiement via HelloAsso, ou par chèque ou par espèces, directement dans une chambre ou dans une boite aux lettres d'un membre du bureau restreint.
            </p>
            <h3>Comment se réforme la cotisation ?</h3>
            <p>
                Si vous avez bien attesté avoir lu et accepté la <a className="link" href={charte} rel="noopener noreferrer" target = "_blank">charte d'utilisation du réseau</a>, vous aurez alors accès au réseau dès que cette personne aura confirmé votre compte ! <br/>
                La cotisation est votée chaque année lors de <b>l'assemblée générale de passation</b> de l'association. C'est après examen d'un bilan moral et financier qu'un vote est réalisé, conformément aux <a className="link" href={statut} rel="noopener noreferrer" target = "_blank">statuts</a> de l'association.
            </p>
        </div>
        <div>
            <h2>Prêts d'équipements</h2>
            <p>
                L'association dispose de quelques équipements qu'elle peut prêter durant une certaine durée en échange d'une caution. Ces équipements comprennent:
                <ul>
                    <li>Des bornes d'appoint en cas de défaillance ou faiblesse <b>avérée et répétée</b> de la connexion</li>
                </ul>
            </p>
        </div>
        <div>
            <h2>Recrutement et passation</h2>
            <p>
                Le recrutement et la passation sont des processus essentiels au Rezal, en effet il est vital de pouvoir assurer la continuité des connaissance sur le Réseau et de permettre aux futures générations de meushards de disposer d'une connexion acceptable.
            </p>
            <h3>Quand cela se passe ?</h3>
            <p>
                Ces processus commencent généralement au début du mois de février, cela permet de laisser assez de temps pour l'association actuelle pour former correctement la future équipe. <br/> 
                Une des valeurs de l'association est son ouverture, il est donc encouragé que n'importe qui suive ces formations, même sans vouloir faire partie de l'association ensuite. Cela permet au Rézal de toucher plus de personnes et pour vous d'en apprendre toujours plus sur ce monde parfois méconnu !
            </p>
            <h3>
                Comment cela se passe
            </h3>
            <p>
                Généralement, quelques membres volontaires du Rézal de l'année préparent des formations pour expliquer aux volontaires les différents aspects du réseau et les fondamentaux.  <br/> 
                Cela ne constitue pas de cours sur les réseaux à proprement parler, mais on peut y voir une approche par l'expérience que les membres du Rézal transmettent. Ces formations durent d'un à deux mois et aboutissent sur une équipe prête à affronter les multiples problèmes pouvant occurir sur le réseau, en garde !
            </p>
        </div>
    </div>
}