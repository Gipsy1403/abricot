"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass, faCalendarDays, faArrowLeftLong, faDiamond} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { statusLabels } from "@/utils/statusLabels";
import * as Avatar from "@radix-ui/react-avatar";
import { initialAvatar } from "@/utils/initialAvatar";


export default function TasksProject({projectId}) {
	const [tasksByproject, setTasksByProject]=useState([]);
	console.log("projectId reçu :", projectId);

	useEffect(()=>{
		if (!projectId)return;
		const getTasksByProject = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8000/projects/${projectId}/tasks`,
					{withCredentials:true}
				);

				// récupération des tâches par projet
				setTasksByProject(response.data.data.tasks);

			} catch (error) {
				console.error("Erreur :", error);
			}
		};
		getTasksByProject();
	}, [projectId]);

	return (
		<>

			<section>
				{tasksByproject.map((tp)=>(
				<Link key={tp.id} href="">
					<div >
						<div>
							<h5>{tp.title}</h5>
							<p>{statusLabels(tp.status)}</p>
						</div>
						<p>{tp.description}</p>
						<p>Echéance : <FontAwesomeIcon icon={faCalendarDays}/> {new Date(tp.dueDate).toLocaleDateString()}</p>
						{/* <p>Assigné à : {""} {tp.assignees.length > 0 ? tp.assignees.map((a) => a.user.name).join(", ") : "Personne"}</p> */}
					
						<p>
						Assigné à :{" "}
						{tp.assignees.length > 0 ? (
						tp.assignees.map((a) => (
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
						</p>
						<div>
							<p>Commentaires({tp.comments.length})</p>
							<FontAwesomeIcon icon={faChevronUp}/>
						</div>
					</div>
				</Link>

				))}
			</section>

		</>
	)
}