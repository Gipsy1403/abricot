"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faCommentDots, faFolderOpen,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import style from "@/app/styles/dashboard/dashboard.module.css"
import { useEffect, useState } from "react";
import axios from "axios";


export default function TasksList() {
	const [tasks, setTasks]=useState([]);

	useEffect(()=>{
		const getTasks = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/dashboard/assigned-tasks",
					{withCredentials:true}
				);

				// récupération des tâches
				setTasks(response.data.data.tasks);

			} catch (error) {
				console.error("Erreur :", error);
			}
		};
		getTasks();
	}, []);

	const statusLabels = {
		TODO: "À faire",
		IN_PROGRESS: "En cours",
		DONE: "Terminée",
	};

	return (
		<section>
			<div>
				<div>
					<h5>Mes tâches assignées</h5>
					<p>Par ordre de priorité</p>
				</div>
				<div>rechercher une tâche <FontAwesomeIcon icon={faMagnifyingGlass}/></div>
			</div>
			{tasks.map((t)=>(
				<div key={t.id}>
					<div className={style.letf_side_task}>
						<div className={style.designation}>
							<h5>{t.title}</h5>
							<p>{t.description}</p>
						</div>
						<div className={style.detail}>
							<p>
								<FontAwesomeIcon icon={faFolderOpen}/>{t.project?.name}
							</p>
							<p>
								<FontAwesomeIcon icon={faCalendar}/>{
									new Date(t.dueDate).toLocaleDateString("fr-FR", {
										day: "numeric",      // jour du mois
										month: "long",       // mois en lettres
									})
								}
							</p>
							<p>
								<FontAwesomeIcon icon={faCommentDots}/>{t.comments.length}
							</p>
						</div>
					</div>
					<div className={style.right_side_task}>
						{statusLabels[t.status]}
						<button>Voir</button>
					</div>
				</div>

			))}
		</section>
	)
}