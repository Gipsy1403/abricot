import Link from "next/link"
import axios from "axios"
import style from "@/app/styles/notFound.module.css"

export default function NotFound() {
	return (
		<div className={style.notFound}>
			<h1>404</h1>
			<p>Oups, cette page n'existe pas</p>
			<Link href="/dashboard">Retour à l'accueil</Link>
		</div>
	)
}