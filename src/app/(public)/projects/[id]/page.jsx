"use client"

import TasksProject from "@/components/projects/TasksProject";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass, faCalendarDays, faArrowLeftLong, faDiamond} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";

export default function ViewProject() {
	const params = useParams();
	const id = params.id;

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
				<p><FontAwesomeIcon icon={faDiamond}/>IA</p>
			</div>
			<div>
				<h5>Contributeurs</h5>
				<p>nombre personnes</p>
				<div>
					<p>avatar</p>
					<p>le propriétaire et les autres contributeurs</p>
				</div>
			</div>
			<div>
				<h5>Tâches</h5> 
				<p>Par ordre de priorité</p>
			</div>
			<div>
				<button><FontAwesomeIcon icon={faListCheck}/>Liste</button>
				<button>Calendrier</button>
				<input type="text" />statut <FontAwesomeIcon icon={faChevronDown}/>
				rechercher une tâche <FontAwesomeIcon icon={faMagnifyingGlass}/>
			</div>
			<TasksProject projectId={id}/>

		</>
	)
}