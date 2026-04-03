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


	const [openModalModify, setOpenModalModify] = useState(false);
	const [openModalCreate, setOpenModalCreate] = useState(false);
	


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
				<a onClick={()=>setOpenModalModify(true)} className={style.modifyProject}>modifier</a>
				{/* MODAL POUR MODIFIER UN PROJET */}
				{openModalModify && (
					<ModalModifyProject onClose={()=>setOpenModalModify(false)} project={project} onProjectUpdated={(updatedProject) => setProject(updatedProject)}/>
				)}
			</div>
			<div>
				<p>{project?.description}</p>
				<button onClick={()=>setOpenModalCreate(true)}>Créer une tâche</button>
				{/* MODAL POUR CREER UNE TACHE */}
				{openModalCreate && (
					<ModalCreateTask onClose={()=>setOpenModalCreate(false)} onTaskCreated={handleTaskCreated} projectId={projectId}/>
				)}
				<p><FontAwesomeIcon icon={faDiamond}/>IA</p>
			</div>
			<div>
				<h5>Contributeurs</h5>
				<p>{project?.members?.length || 0} {project?.members?.length === 0 
					?"aucune personne"
					: project?.members?.length >1 
					? "personnes" 
					: "personne"}</p>
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