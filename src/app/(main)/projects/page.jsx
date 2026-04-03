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

export default function Projects() {
	const [openModal, setOpenModal]=useState(false)
	const [projects, setProjects]=useState([]);


	useEffect(()=>{
		const getProjects = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/projects",
					{withCredentials:true}
				);

				// récupération des projets
				setProjects(response.data.data.projects);

			} catch (error) {
				console.error("Erreur :", error);
			}
		};
		getProjects();
	}, []);

	const handleProjectCreated=(newProject)=>{
		console.log("NEW PROJECT :", newProject);
		setProjects((prev)=>[...prev, newProject])
	}
	return (
		<>
			<div>
				<div>
					<h4>Mes projets</h4>
					<p>Gérez vos projet</p>
				</div>
				<button onClick={()=>setOpenModal(true)}>+ Créer un projet</button>
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
						<p>{p.description}</p>
						{/* 📊 Progression */}
						<Progress.Root className={style.progressRoot}>
							<Progress.Indicator
								className={style.progressIndicator}
								style={{ transform: `translateX(-${100 - (p.progress || 0)}%)` }}
							/>
						</Progress.Root>
						{/* 👥 Équipe */}
						<div className={style.team}>
						{p.members?.map((m, index) => (
							<Avatar.Root key={index} className={style.avatar}>
								<Avatar.Fallback className={style.name_avatar}>
									{initialAvatar(m.user?.name)}
								</Avatar.Fallback>
							</Avatar.Root>
						))}
						</div>
					</div>
				</Link>
				))}
			</div>
		</>
	)
}