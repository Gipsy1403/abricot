"use client"
import TasksKanban from "@/components/dashboard/TasksKanban";
import TasksList from "@/components/dashboard/TasksList";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faListCheck, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Dashboard() {
	 const [view, setView] = useState("list");

	return (
		<>
			<div>
				<div>
					<h4>Tableau de bord</h4>
					<p>Bonjour (prénom Nom), voici un aperçu de vos projets et tâches</p>
				</div>
				<button>+ Créer un projet</button>
			</div>
			<div>
				<button onClick={()=>setView("list")}><FontAwesomeIcon icon={faListCheck}/>Liste</button>
				<button onClick={()=>setView("kanban")}><FontAwesomeIcon icon={faCalendarDays}/>Kanban</button>
			</div>

			{view === "kanban" ? <TasksKanban /> : <TasksList />}
			
		</>
	)
}