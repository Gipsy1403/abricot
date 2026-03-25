import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
export default function TasksProject() {
	return (
		<>
			<div>
				<h5>Tâches</h5>
				<p>Par ordre de priorité</p>
			</div>
			<div>
				<button><FontAwesomeIcon icon={faListCheck}/>Liste</button>
				<button>Calendrier</button>
				<input type="text" />statut <FontAwesomeIcon icon={faChevronDown}/>
				rechercher une tâche <FontAwesomeIcon icon={faListCheck}/>
			</div>
			<section>
				<div>
					<div>
						<h5>nom tache</h5>
						<p>priorité</p>
					</div>
					<p>description</p>
					<p>Echéance : <FontAwesomeIcon icon={faCalendarDays}/>date</p>
					<p>Assigné à : contributeurs (avatar et nom entier)</p>
					<div>
						<p>Commentaires(nombre)</p>
						<FontAwesomeIcon icon={faChevronUp}/>
					</div>
				</div>
			</section>

		</>
	)
}