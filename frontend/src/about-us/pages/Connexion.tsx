

export default function Connexion() {

    return <div style={{textAlign : "left"}}>
        <h1>Se connecter au réseau</h1>
        <p>
            Le nom du réseau pour les cotisants est <b>Rezal</b>. 
            Il suffit d'entrer un login et un mot de passe et s'ils correspondent à un compte approuvé par l'association alors l'accès est confirmé et l'appareil a accès à internet.
        </p>
        <h2>Certificat</h2>
        <p>Parfois, l'appareil peut demander un <b>certificat</b> d'authentification, qui n'est pas obligatoire, il est donc recommander d'indiquer <b>pas de certificat</b> lors de la connexion.</p>
    </div>
}