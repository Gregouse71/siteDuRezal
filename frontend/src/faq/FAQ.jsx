import "./FAQ.scss"
import { Link } from "react-router-dom";

const questions = [
    {
        question: "Mon wifi marche pas, que faire ?",
        reponse: "Continuer à lire la FAQ à la recherche d'une meilleure réponse, s'il n'y en a pas ou qu'elle ne marche pas faire un mail.\n\
        D'abord, est-ce que tu as le bon identifiant ? Il est de la forme XXnomdefamille. C'est pas le mail.",
        key: "a"
    },
    {
        question: "Je veux rejoindre le Rézal pour réparer mon wifi ! Je fais comment ?",
        reponse: <>Va dire bonjour au bureau (<Link to="/about-us">infos</Link>), et si tu sais pas les trouver fait un mail.</>,
        key: "b"
    },
    {
        question: "Quelle est la politique de sécurité du réseau ?",
        reponse: "Aux Mines, on pense qu'on est une grande famille. Alors le réseau n'est pas séparé entre les différents utilisateurs, vous pouvez vous connecter pour faire une partie de Minecraft en LAN avec votre voisin, partager des fichier avec un simple \"python -m http.server\", ou d'autres choses. Cela fait aussi qu'il faut configurer correctement votre ordinateur si par exemple vous avez un partage de photos d'activé pour chez vous, pensez à le désactiver pour la Meuh",
        key: "c"
    },
    {
        question: "Ma prise Ethernet ne marche pas du tout",
        reponse: "Il n'y en a qu'une de raccordée par chambre, celle étiquetée INFO. L'autre ne l'est pas, faut négocier avec son co.",
        key: "d"
    },
    {
        question: "J'ai du mal à me connecter à l'Ethernet",
        reponse: "On a quelques lenteurs à l'initialisation de la connexion Ethernet... Ça peut prendre jusqu'à une ou deux minutes avant que la connexion s'établisse. Ensuite il y a un portail captif qui s'ouvre (ou juste ouvrez un navigateur internet.",
        key: "e"
    },
    // QuestionItem("Encore en cours...", "")

];

export default function FAQ() {
    return (
        <div className="about-us-layout">
            <nav className="toc-sidebar">
                <div className="toc-sticky">
                    <ul>
                        {questions.map(({ question, key }, ind) => <li><a href={`#${key}`}>{question}</a></li>)}
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