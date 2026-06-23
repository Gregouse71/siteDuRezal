import { helloAssoURL } from "../helloasso";
import "./FAQ.scss"
import { Link } from "react-router-dom";

const questions = [
    {
        question: "Ma connexion WiFi est instable",
        reponse: <>Si ta chambre est loin des bornes, nous ne pouvons rien faire pour améliorer la connexion. Essaie de te connecter au réseau <b>Rezal-2.4GHz</b> pour mieux capter. En cas de trop mauvais signal, il est possible d'obtenir une petite borne à placer dans ta chambre.</>,
        key: "wifi-instable"
    },
    {
        question: "Ma prise ethernet ne marche pas",
        reponse: <>Certaines chambres disposent d'une prise ethernet fonctionnelle (souvent marquée d'une étiquette <i>Info</i> ou <i>PC</i>). Si la tienne ne fonctionne pas, nous ne pouvons pas la rendre fonctionnelle.</>,
        key: "ethernet-absent"
    },
    {
        question: "Je n'arrive pas à me connecter au WiFi",
        reponse: <>Pour se connecter, il faut avoir <b>créé un compte sur notre site</b>, <b>cotisé sur <a href={helloAssoURL} target="_blank" rel="noopener noreferrer">HelloAsso</a></b>, et <b><Link to="/resident/board">activé ta cotisation pour le trimestre</Link></b>. Si après avoir fait ça tu n'as toujours pas accès au réseau, assure toi d'utiliser le <b>bon identifiant et mot de passe</b>, et d'avoir correctement suivi les consignes de connexion <Link to="/about-us">ici</Link>.</>,
        key: "wifi-impossible"
    },
    {
        question: "J'ai oublié mon mot de passe",
        reponse: <>Réinitialise le <Link to="/resident/login">ici</Link>.</>,
        key: "mot-de-passe"
    },
    {
        question: "Mon crédit n'apparaît pas sur ma page alors que j'ai cotisé sur HelloAsso",
        reponse: <>Si tu n'as pas utilisé le même mail pour cotiser sur HelloAsso et pour créer ton compte, ou si tu as cotisé avant de créer ton compte, ton crédit n'apparaîtra pas. Il faut que tu nous <a href="mailto:admin@rezal-mdm.com">contacte</a> directement.</>,
        key: "credit-absent"
    },
    {
        question: "Je suis connecté au wifi mais je n'ai pas accès à internet",
        reponse: <>Si tu as utilisé des protocoles de téléchargement en pair à pair (P2P), tu as probablement été bloqué par notre pare-feux. Tu seras débloqué automatiquement sous 12h, ne t'avise pas de recommencer.</>,
        key: "pas-internet"
    }
];

export default function FAQ() {
    return (
        <div className="about-us-layout">
            <nav className="toc-sidebar">
                <div className="toc-sticky">
                    <ul>
                        {questions.map(({ question, key }, ind) => <li key={ind}><a href={`#${key}`}>{question}</a></li>)}
                    </ul>
                </div>
            </nav>


            <main className="about-us-content">
                <h2>FAQ</h2>

                {questions.map((elt, ind) => <div id={elt.key} key={ind}>{QuestionItem(elt)}</div>)}
            </main>
        </div>
    );
}


function QuestionItem({ question, reponse }) {
    return <>
        <h3>{question}</h3>
        <p>{reponse}</p>
    </>
}