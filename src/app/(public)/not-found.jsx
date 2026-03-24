import Link from "next/link"

export default function NotFound() {
	return (
		<div>
			<h1>public Not Found</h1>
			<p>Oups, cette page n'existe pas</p>
			<Link href="/">Retour à l'accueil</Link>
		</div>
	)
}