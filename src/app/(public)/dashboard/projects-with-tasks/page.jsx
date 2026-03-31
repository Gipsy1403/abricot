"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass, faCalendarDays, faArrowLeftLong, faDiamond} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { statusLabels } from "@/utils/statusLabels";
import * as Avatar from "@radix-ui/react-avatar";
import { initialAvatar } from "@/utils/initialAvatar";


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

			<section>
				<Link href="/dashboard/assigned-tasks"><button>Mes tâches assignées</button></Link>
				<Link href="/dashboard/projects-with-tasks"><button>Mes projets assignés</button></Link>
				<div>
					<h5>Mes projets assignés</h5>
					<p>Par ordre de priorité</p>
				</div>
				{projectsWithTasks.map((pt)=>(
				// <Link  href="">
					<div key={pt.id}>
						<div >
							<h5>{pt.name}</h5>
							<p>{statusLabels(pt.status)}</p>
						</div>
						<p>{pt.description}</p>
						<p>Echéance : <FontAwesomeIcon icon={faCalendarDays}/> {new Date(pt.dueDate).toLocaleDateString()}</p>

					
						{/* <p>
						Assigné à :{" "}
						{pt.assignees.length > 0 ? (
						pt.assignees.map((a) => (
							<span key={a.user.id}>
							<Avatar.Root>
								<Avatar.Fallback>{initialAvatar(a.user?.name)}</Avatar.Fallback>
							</Avatar.Root>
							{a.user.name}
							</span>
						))
						) : (
						"Personne"
						)}
						</p> */}
						<div>
							<p>Commentaires({pt.comments?.length})</p>
							<FontAwesomeIcon icon={faChevronUp}/>
						</div>
					</div>
				// </Link>

				))}
			</section>

		</>
	)
}