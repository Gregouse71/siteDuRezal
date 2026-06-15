import { Link } from "react-router-dom";

const questions = [
    QuestionItem(
        "Mon wifi marche pas, que faire ?",
        "Continuer à lire la FAQ à la recherche d'une meilleure réponse, s'il n'y en a pas ou qu'elle ne marche pas faire un mail.\n\
        D'abord, est-ce que tu as le bon identifiant ? Il est de la forme XXnomdefamille. C'est pas le mail."
    ),
    QuestionItem(
        "Je veux rejoindre le Rézal pour réparer mon wifi ! Je fais comment ?",
        <>Va dire bonjour au bureau (<Link to="/about-us">infos</Link>), et si tu sais pas les trouver fait un mail.</>, 
    ),
    QuestionItem(
        "Quelle est la politique de sécurité du réseau ?",
        "Aux Mines, on pense qu'on est une grande famille. Alors le réseau n'est pas séparé entre les différents utilisateurs, vous pouvez vous connecter pour faire une partie de Minecraft en LAN avec votre voisin, partager des fichier avec un simple \"python -m http.server\", ou d'autres choses. Cela fait aussi qu'il faut configurer correctement votre ordinateur si par exemple vous avez un partage de photos d'activé pour chez vous, pensez à le désactiver pour la Meuh"
    ),
    QuestionItem(
        "Ma prise Ethernet ne marche pas du tout",
        "Il n'y en a qu'une de raccordée par chambre, celle étiquetée INFO. L'autre ne l'est pas, faut négocier avec son co."
    ),
    QuestionItem(
        "J'ai du mal à me connecter à l'Ethernet",
        "On a quelques lenteurs à l'initialisation de la connexion Ethernet... Ça peut prendre jusqu'à une ou deux minutes avant que la connexion s'établisse. Ensuite il y a un portail captif qui s'ouvre (ou juste ouvrez un navigateur internet."
    ),
    QuestionItem("Encore en cours...","")

];

export default function FAQ() {
    return (
        <>
            <h2>FAQ</h2>
            {questions}
        </>
    );
}


function QuestionItem(question:string, reponse:string | JSX.Element ) {
    return <details open={false}>
        <summary>{question}</summary>
        <p>{reponse}</p>
        </details>
}