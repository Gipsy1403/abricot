import { faArrowLeftLong, faDiamond } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Projects() {
	return (
		<>
			<Link href="/projects">
				<FontAwesomeIcon icon={faArrowLeftLong}/>
			</Link>
			<div>
				<h4>nomdu projet</h4>
				<Link href="">modifier</Link>
			</div>
			<div>
				<p>description</p>
				<button>Créer une tâche</button>
			</div>
			<div>
				<p><FontAwesomeIcon icon={faDiamond}/>IA</p>
				<h5>Contributeurs</h5>
				<p>nombre personnes</p>
				<div>
					<p>avatar</p>
					<p>le propriétaire et les autres contributeurs</p>
				</div>
			</div>

		</>
	)
}