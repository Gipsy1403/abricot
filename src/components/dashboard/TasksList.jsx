"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faCommentDots, faFolderOpen,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import style from "@/app/styles/dashboard/dashboard.module.css"
import { useEffect, useState } from "react";
import axios from "axios";
import Tag from "@/utils/tags";
import Button from "../public/Button";
import ModalModifyTask from "../projects/tasks/modals/ModalModifyTask";
import { useRouter } from "next/navigation";


export default function TasksList() {
	const [tasks, setTasks]=useState([]);
	const [selectedTask, setSelectedTask] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const router=useRouter();

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

	// Filtrer les tâches en fonction du titre (à partir de 2 caractères)
	const filteredTasks = searchQuery.length >= 2
		? tasks.filter((t) =>
				t.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
		: tasks;

	return (
		<section className={style.sectionTasks}>
			<div className={style.tasksHeader}>
				<div>
					<h2>Mes tâches assignées</h2>
					<p>Par ordre de priorité</p>
				</div>
				<div className={style.taskSearch}>
					<input
						type="text"
						placeholder="Rechercher une tâche"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						aria-label="Rechercher une tâche par titre"
					/>
					<FontAwesomeIcon icon={faMagnifyingGlass}/>
				</div>
			</div>
			{filteredTasks.map((t)=>(
				<div key={t.id} className={style.taskCard}>
					<div className={style.taskLeft}>
						<div className={style.designation}>
							<h2>{t.title}</h2>
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
					<div className={style.taskRight}>

  						<Tag type={statusLabels[t.status]} />

						{/* <span className={style.taskStatus}>{statusLabels[t.status]}</span> */}
						{/* <Link href={`/dashboard/projects-with-tasks/${t.projet?.id}`}><button>Voir</button></Link> */}
						<Button 

							onClick={() => {
								router.push(`/projects/${t.project?.id}`);
							}} 
							text="Voir" 
							disabled={false}
						/>
					</div>
				</div>
			))}
			{/* MODAL POUR MODIFIER UNE TACHE*/}
			{selectedTask && (
				<ModalModifyTask
					onClose={() => setSelectedTask(null)}
			projectId={selectedTask.projectId || selectedTask.project?.id}
					// projectId={selectedTask.project?.id}
					taskId={selectedTask.id}
					onTaskUpdated={(updatedTask) => {
						setTasks((prev) =>
						prev.map((task) =>
							task.id === updatedTask.id ? updatedTask : task
						)
						);
					}}
				/>
			)}
		</section>
	)
}