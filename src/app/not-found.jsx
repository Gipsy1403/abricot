import Link from "next/link"
import axios from "axios"

export default function NotFound() {
	return (
		<div>
			<h1>Root Not Found</h1>
			<p>Oups, cette page n'existe pas</p>
			<Link href="/dashboard">Retour à l'accueil</Link>
		</div>
	)
}