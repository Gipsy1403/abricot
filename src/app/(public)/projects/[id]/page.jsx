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
import ModifyProject from "@/components/public/modals/projects/modifyproject";




export default function ViewProject() {
	const params = useParams();
	const id = params.id;

	console.log("params :", params);
	console.log("id :", id);

	const [project, setProject] = useState(null); //stocke le projet
	const [loading, setLoading] = useState(true); // affiche un chargement

	const[openModal, setOpenModal]=useState(false);
	
	console.log("project state :", project);

	useEffect(() => {
		const fetchProject = async () => {
			try {
			console.log("Appel API avec id :", id);
			const response = await axios.get(`http://localhost:8000/projects/${id}`, {
				withCredentials: true,
			});
			setProject(response.data.data.project);
			} catch (error) {
				console.error("Erreur lors de la récupération du projet :", error);
			}finally {
			setLoading(false);
			}
		};
		fetchProject();
	}, [id]);

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
				{openModal && (
					<ModifyProject onClose={()=>setOpenModal(false)}/>
				)}
			</div>
			<div>
				<p>{project?.description}</p>
				<button>Créer une tâche</button>
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
			<TasksProject projectId={id}/>

		</>
	)
}