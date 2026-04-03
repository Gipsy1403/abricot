"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import style from "@/app/styles/dashboard/dashboard.module.css"
import { useState,useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function TasksKanban() {
	const [tasks, setTasks]=useState([]);

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

	// filtre des tâches par statut
	const todoTasks = tasks.filter((t) => t.status === "TODO");
	const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
	const doneTasks = tasks.filter((t) => t.status === "DONE");

	// traduction des status
	const statusLabels = {
		TODO: "À faire",
		IN_PROGRESS: "En cours",
		DONE: "Terminée",
	};
	
	return (
		<>
		<section>
			{/* <Link href="/dashboard/assigned-tasks"><button>Mes tâches assignées</button></Link>
			<Link href="/dashboard/projects-with-tasks"><button>Mes projets assignés</button></Link> */}

			<h5>A faire</h5>
			{todoTasks.length}
			{todoTasks.map((t)=>(
				<div key={t.id}>
					<div>
						<h5>{t.title}</h5>
						{statusLabels[t.status]}
					</div>
					<p>{t.description}</p>
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
							<FontAwesomeIcon icon={faComment}/>{t.comments.length}
						</p>
					</div>
					<Link href="/dashboard/projectswithtasks"><button>Voir</button></Link>
				</div>
			))}
		</section>
		<section>
			<h5>En cours</h5>
			{inProgressTasks.length}
			{inProgressTasks.map((t)=>(
				<div key={t.id}>
					<div>
						<h5>{t.title}</h5>
						{statusLabels[t.status]}
					</div>
					<p>{t.description}</p>
					<div className={style.detail}>
						<p>
							<FontAwesomeIcon icon={faFolderOpen}/>{t.project?.name}
						</p>
						<p>
							<FontAwesomeIcon icon={faCalendar}/>{new Date(t.dueDate).toLocaleDateString()}
						</p>
						<p>
							<FontAwesomeIcon icon={faComment}/>{t.comments.length}
						</p>
					</div>
					<Link href="/dashboard/projectswithtasks"><button>Voir</button></Link>

				</div>
			))}
		</section>
		<section>
			<h5>Terminées</h5>
			{doneTasks.length}
			{doneTasks.map((t)=>(
				<div key={t.id}>
					<div>
						<h5>{t.title}</h5>
						{statusLabels[t.status]}
					</div>
					<p>{t.description}</p>
					<div className={style.detail}>
						<p>
							<FontAwesomeIcon icon={faFolderOpen}/>{t.project?.name}
						</p>
						<p>
							<FontAwesomeIcon icon={faCalendar}/>{new Date(t.dueDate).toLocaleDateString()}
						</p>
						<p>
							<FontAwesomeIcon icon={faComment}/>{t.comments.length}
						</p>
					</div>
					<Link href="/dashboard/projectswithtasks"><button>Voir</button></Link>

				</div>
			))}
		</section>
		</>
	)
}