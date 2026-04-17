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
import { useRouter } from "next/navigation";
import ModalAICreateTask from "@/components/projects/tasks/modals/ModalAICreateTask";



export default function ViewProject() {
	const router=useRouter();

	const {projectId} = useParams();

	const [project, setProject] = useState(null); //stocke le projet
	const [loading, setLoading] = useState(true); // affiche un chargement
	// const [tasks, setTasks] = useState([]); // affiche toutes les taches du projet

	const [openModalModify, setOpenModalModify] = useState(false);
	const [openModalCreate, setOpenModalCreate] = useState(false);
	
	const [tasks, setTasks] = useState([]);

	// concerne l'IA
	const [openAIModal, setOpenAIModal] = useState(false);
	const [iaTask, setIaTask] = useState([]);
	const [iaLoading, setIaLoading] = useState(false);
	
	useEffect(() => {
		const fetchProject = async () => {
			try {

			const response = await axios.get(`http://localhost:8000/projects/${projectId}`, {
				withCredentials: true,
			});
			// console.log("📥 API PROJECT :", response.data.data.project); 
			// setProject({
			// 	...response.data.data.project,
			// 	tasks: response.data.data.project.tasks || [],
			// });
			const projectData = response.data.data.project;

			setProject(projectData);
			setTasks(projectData.tasks || []);

			} catch (error) {
				console.error("Erreur lors de la récupération du projet :", error);
			}finally {
			setLoading(false);
			}
		};
		fetchProject();
	}, [projectId]);


	  // Fonction pour ajouter une tâche créée
	// const handleTaskCreated = (newTask) => {
	// 	setProject((prevProject) => ({
	// 		...prevProject,
	// 		tasks: [...(prevProject.tasks || []), newTask], // ajoute la nouvelle tâche
	// 	}));

	// const handleTaskUpdated = (updatedTask) => {
	// 	setTasks((prev) =>
	// 		prev.map((t) =>
	// 			t.id === updatedTask.id ? updatedTask : t
	// 		)
	// 	);
	// };
	const handleTaskUpdated = (payload, action) => {
  if (action === "delete") {
    setTasks((prev) => prev.filter((t) => t.id !== payload));
    return;
  }

  setTasks((prev) =>
    prev.map((t) =>
      t.id === payload.id ? payload : t
    )
  );
};
		
	// };
	const handleTaskCreated = (newTask) => {
  setTasks((prev) => [...prev, newTask]);
};
	
	const generateIATask = async (message) => {
		if (!message || message.trim() === "") return;

		try {
			setIaLoading(true);
    console.log("PROJECT ID:", projectId);
    console.log("PROMPT:", message);
			const res = await axios.post(
			`http://localhost:8000/projects/${projectId}/tasks/generate-rag`,
			{ prompt: message,
			  projectId,
			 },
			 {withCredentials: true}
			);
console.log("REPONSE IA:", res.data);
			setIaTask(res.data.tasks);
		} catch (error) {
			// console.error("Erreur IA :", error);
			console.error("Erreur IA :", error.response?.data || error.message);
		} finally {
			setIaLoading(false);
		}
  	};

	
	if (loading) {
		return <p>Chargement du projet...</p>;
	}

	const filteredMembers = project?.members?.filter((m) => m?.user?.id !== project?.owner?.id);
	
	// console.log("🧠 STATE PROJECT :", project);

	return (
		<>
			{/* DESCRIPTIF D UN PROJET SPECIFIQUE */}
			<div className={style.container}>
				{/* <Link  href="/projects"> */}
					<FontAwesomeIcon className={style.iconReturn} icon={faArrowLeftLong}  onClick={() => router.push("/projects")}/>
				{/* </Link> */}
				<div className={style.containerTitle}>
					<div className={style.titleProject}>
						<h4>{project?.name}</h4>
						<a onClick={()=>setOpenModalModify(true)} className={style.modifyProject}>Modifier</a>
						{/* MODAL POUR MODIFIER UN PROJET */}
						{openModalModify && (
							<ModalModifyProject 
							onClose={()=>setOpenModalModify(false)} 
							project={project} 
							onProjectUpdated={(updatedProject) => setProject(updatedProject)}/>
						)}
					</div>
					<p>{project?.description}</p>
				</div>

				{/* BOUTONS POUR CREER UNE TACHE */}
				<div className={style.containerBtns}>
					<button onClick={()=>setOpenModalCreate(true)}>Créer une tâche</button>
					{/* MODAL POUR CREER UNE TACHE */}
					{openModalCreate && (
						<ModalCreateTask 
						onClose={()=>setOpenModalCreate(false)} 
						onTaskCreated={handleTaskCreated} 
						projectId={projectId}/>
					)}
					{/* <p><FontAwesomeIcon icon={faDiamond}/> IA</p> */}
					<button
						onClick={() => setOpenAIModal(true)}
						className={style.iaButton}
					>
						<FontAwesomeIcon icon={faDiamond} /> IA
					</button>
					{/* MODAL POUR CREER UNE TACHE AVEC IA */}
					{openAIModal && (
						<ModalAICreateTask
							onClose={() => {
								setOpenAIModal(false);
								setIaTask([]);
							}}
							iaTask={iaTask}
							setIaTask={setIaTask}
							generateIATask={generateIATask}
							iaLoading={iaLoading}
							onTaskCreated={handleTaskCreated}
							projectId={projectId}
						/>
					)}
				</div>
			</div>

			{/* CONTAINER DES CONTRIBUTEURS */}
			<div className={style.containerContributors}>
				<div className={style.leftSide}>
					<h5>Contributeurs</h5>
					<p>{project?.members?.length || 0} {project?.members?.length === 0
			       			?"aucune personne"
						: project?.members?.length >1
						? "personnes"
						: "personne"}</p>
				</div>
				<div className={style.team}>
				{/* Afficher le propriétaire en premier */}
				{project?.owner && (
				<div key={project.owner.id} className={style.member}>
					<div className={`${style.avatar} ${style.ownerAvatar}`}>
					<p>{initialAvatar(project.owner.name)}</p>
					</div>
					<p className={`${style.name} ${style.ownerName}`}>Propriétaire</p>
				</div>
				)}

				{/* Afficher les autres contributeurs */}
				{filteredMembers?.map((m) => {

				return (
					<div key={m.user.id} className={style.member}>
					<div className={`${style.avatar} ${style.memberAvatar}`}>
						<p>{initialAvatar(m.user.name)}</p>
					</div>
					<p className={`${style.name} ${style.memberName}`}>{m.user.name}</p>
					</div>
				);
				})}
				</div>
			</div>

			{/* TACHES DU PROJET */}
			{/* <TasksProject tasks={project?.tasks || []} projectId={projectId}/> */}
			<TasksProject
  tasks={tasks}
  setTasks={setTasks}
  projectId={projectId}
  onTaskUpdated={handleTaskUpdated}
/>
		</>
	)
}