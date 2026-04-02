"use client"

import TasksProject from "@/components/projects/TasksProject";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass, faCalendarDays, faArrowLeftLong, faDiamond, faCircleChevronUp} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import style from "@/app/styles/projects/projects.module.css"
import { useState,useEffect } from "react";
import axios from "axios";
import { initialAvatar } from "@/utils/initialAvatar";
import ModalModifyProject from "@/components/projects/modals/ModalModifyProject";
import ModalCreateTask from "@/components/projects/tasks/modals/ModalCreateTask";


export default function ViewProject() {
	const {projectId} = useParams();

	const [project, setProject] = useState(null); //stocke le projet
	const [loading, setLoading] = useState(true); // affiche un chargement
	const [tasks, setTasks] = useState(true); // affiche toutes les taches du projet


	const[openModal, setOpenModal]=useState(false);
	


	useEffect(() => {
		const fetchProject = async () => {
			try {

			const response = await axios.get(`http://localhost:8000/projects/${projectId}`, {
				withCredentials: true,
			});
			setProject({
				...response.data.data.project,
				tasks: response.data.data.project.tasks || [],
			});
			// setProject(response.data.data.project);
			// setTasks(response.data.data.project.tasks || []) // initialise les taches
			} catch (error) {
				console.error("Erreur lors de la récupération du projet :", error);
			}finally {
			setLoading(false);
			}
		};
		fetchProject();
	}, [projectId]);

	  // Fonction pour ajouter une tâche créée
	const handleTaskCreated = (newTask) => {
		setProject((prevProject) => ({
			...prevProject,
			tasks: [...prevProject.tasks, newTask], // ajoute la nouvelle tâche
		}));
		
	};

	if (loading) {
		return <p>Chargement...</p>;
	}

	return (
		<>
			<Link href="/projects">
				<FontAwesomeIcon icon={faArrowLeftLong}/>
			</Link>
			<div>
				<h4>{project?.name}</h4>
				<p onClick={()=>setOpenModal(true)}>modifier</p>
				{/* MODAL POUR MODIFIER UN PROJET */}
				{openModal && (
					<ModalModifyProject onClose={()=>setOpenModal(false)}/>
				)}
			</div>
			<div>
				<p>{project?.description}</p>
				<button onClick={()=>setOpenModal(true)}>Créer une tâche</button>
				{/* MODAL POUR CREER UNE TACHE */}
				{openModal && (
					<ModalCreateTask onClose={()=>setOpenModal(false)} onTaskCreated={handleTaskCreated} projectId={projectId}/>
				)}
				<p><FontAwesomeIcon icon={faDiamond}/>IA</p>
			</div>
			<div>
				<h5>Contributeurs</h5>
				<p>{project?.members?.length || 0} personnes</p>
				<div className={style.team}>
					{project?.members?.map((m) => (
					// Conteneur pour 1 contributeur
					<div key={m.user?.id} className={style.member}>
						<div className={style.avatar}>
							<p>{initialAvatar(m.user?.name)}</p>
						</div>
						<p className={style.name}>{m.user?.name}</p>
					</div>
					))}
				</div>
			</div>
			<TasksProject tasks={project.tasks}/>

		</>
	)
}