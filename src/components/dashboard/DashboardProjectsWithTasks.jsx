"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass, faCalendarDays, faArrowLeftLong, faDiamond} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { statusLabels } from "@/utils/statusLabels";
import * as Avatar from "@radix-ui/react-avatar";
import { initialAvatar } from "@/utils/initialAvatar";
import Button from "../public/Button";
import style from "@/app/styles/dashboard/dashboard.module.css"


export default function DashboardProjectsWithTasks() {
	const [projectsWithTasks, setProjectsWithTasks]=useState([]);

	useEffect(()=>{

		const getProjectsWithTasks = async () => {
			try {
				console.log("🚀 Requête envoyée...");
				const response = await axios.get(
					`http://localhost:8000/dashboard/projects-with-tasks`,
					{withCredentials:true}
				);
				console.log("✅ Réponse complète :", response);
				// récupération le projet par tâches
				console.log("📦 Data :", response.data);
				setProjectsWithTasks(response.data.data.projects);

			} catch (error) {
				console.error("Erreur :", error);
				if (error.response) {
					console.error("📡 Réponse serveur :", error.response);
					console.error("📡 Status :", error.response.status);
					console.error("📡 Data erreur :", error.response.data);
				}
			}
		};
		getProjectsWithTasks();
	}, []);

	return (
		<>

			<section className={style.sectionProjects}>
				<div className={style.projectsHeader}>
					<div>
						<h5>Les projets dans lesquels j'ai des tâches assignées</h5>
						<p>Par ordre de priorité</p>
					</div>
				</div>
				{projectsWithTasks.map((pt)=>(
					<div key={pt.id} className={style.projectCard}>
						<div className={style.projectLeft}>
							<div className={style.designation}>
								<h5>{pt.name}</h5>
								<p>{pt.description}</p>
							</div>
						</div>
						{/* <Link className={style.projectRight} href={`/projects/${pt.id}`}>
							<button>Voir</button>
						</Link> */}
					</div>
				))}
			</section>

		</>
	)
}