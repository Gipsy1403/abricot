"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState,useEffect } from "react";
import * as Progress from "@radix-ui/react-progress";
import * as Avatar from "@radix-ui/react-avatar";
import style from "@/app/styles/projects/projects.module.css"
import axios from "axios";
import { initialAvatar } from "@/utils/initialAvatar";
import Link from "next/link";
import ModalCreateProject from "@/components/projects/modals/ModalCreateProject";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/public/Button";
import ModalModifyProject from "@/components/projects/modals/ModalModifyProject";
import { usePathname } from "next/navigation";

export default function Projects() {

	const [openModal, setOpenModal]=useState(false)
	const [projects, setProjects]=useState([]);
	// const [selectedProjects, setSelectedProjects]=useState([]);
	// va permetre de relancer la page à chaque rendu
	const pathname = usePathname();

	useEffect(() => {

		const getProjects = async () => {
		try {

			// 1️⃣ récupérer les projets
			const response = await axios.get(
			"http://localhost:8000/projects",
			{ withCredentials: true }
			);
console.log("📦 DATA BRUTE API :", response.data.data.projects);
			const projectsData = response.data.data.projects;

			// 2️⃣ pour chaque projet → récupérer ses tâches
			const projectsWithProgress = await Promise.all(

			projectsData.map(async (p) => {

				// 🔥 appel API pour les tâches du projet
				const resTasks = await axios.get(
				`http://localhost:8000/projects/${p.id}/tasks`,
				{ withCredentials: true }
				);

				const tasks = resTasks.data.data.tasks;

				// 3️⃣ calcul progression

				const total = tasks.length;

				const done = tasks.filter(
				(t) => t.status === "DONE"
				).length;

				const progress = total > 0
				? Math.round((done / total) * 100)
				: 0;

				// 4️⃣ on retourne le projet enrichi
				return {
				...p,
				progress,
				done,
				total
				};
			})
			);
console.log("📦 DATA AVEC PROGRESS :", projectsWithProgress);
			// 5️⃣ on stocke
			setProjects(projectsWithProgress);

		} catch (error) {
			console.error("Erreur :", error);
		}
		};

		getProjects();

	}, [pathname]);

	const handleProjectCreated=(newProject)=>{
		console.log("NEW PROJECT :", newProject);
		setProjects((prev)=>[...prev, newProject])
	}

	// const handleProjectUpdated = (updatedProject) => {
	// setProjects(prev =>
	// prev.map(p => p.id === updatedProject.id ? updatedProject : p)
	// );
	// };
	
	return (
		<>
			<div className={style.projectsHeader}>
				<div>
					<h4>Mes projets</h4>
					<p>Gérez vos projets</p>
				</div>
				<Button onClick={()=>setOpenModal(true)} text="+ Créer un projet" disabled={false}/>
				{/* MODAL POUR CREER UN PROJET*/}
				{openModal && (
					<ModalCreateProject onClose={()=>setOpenModal(false)} onProjectCreated={handleProjectCreated}/>
				)}
			</div>
			<div  className={style.container_card}>
				{projects.map((p) => (
				<Link key={p.id} href={`/projects/${p.id}`}>
					<div  className={style.card}>
						<h2>{p.name}</h2>
						<p className={style.descriptionCard}>{p.description}</p>
						<div className={style.barProgress}>
							<div className={style.progressHeader}>
								<span >Progression</span>
								<span className={style.score}>{p.progress}%</span>
							</div>
							<Progress.Root className={style.progressRoot} value={p.progress}>
								<Progress.Indicator
									className={style.progressIndicator}
									style={{ transform: `translateX(-${100 - (p.progress)}%)` }}
									/>
							</Progress.Root>
							<p className={style.progressText}> {p.done}/{p.total} {p.done >1 ? "tâches terminées" : "tâche terminée"}</p>
						</div>
						<p className={style.iconTeam} ><FontAwesomeIcon icon={faUserGroup}/> Equipes ({p.members?.length})</p>
						<div className={style.teams} >
							{p?.owner && (
								<div key={p.owner.id} className={style.ownerProject}>
									<p className={style.ownerAvatarProject}>{initialAvatar(p.owner.name)}</p>
									<p className={style.ownerNameProject}>Propriétaire</p>
								</div>
							)}
							
								{p.members?.filter((m) => m.user?.id !== p.owner?.id).map((m, index) => (
									<Avatar.Root key={index} className={style.avatarGroupProject}>
										<Avatar.Fallback className={style.nameAvatarProject}>
											{initialAvatar(m.user?.name)}
										</Avatar.Fallback>
									</Avatar.Root>
								))}
						</div>
					</div>
				</Link>
				))}
			</div>
						{/* MODALE POUR MODIFIER UN PROJET */}
			{/* {openModal && selectedProject && (
				<ModalModifyProject
					project={selectedProject}
					onClose={() => {
						setOpenModal(false);
						setSelectedProject(null);
					}}
					onProjectUpdated={handleProjectUpdated} // 🔹 on met à jour la liste globale
				/>
			)} */}
		</>
	)
}