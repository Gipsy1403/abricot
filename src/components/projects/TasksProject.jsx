"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass, faCalendarDays, faArrowLeftLong, faDiamond} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { statusLabels } from "@/utils/statusLabels";
import * as Avatar from "@radix-ui/react-avatar";
import { initialAvatar } from "@/utils/initialAvatar";
import * as Accordion from "@radix-ui/react-accordion";
import style from "@/app/styles/projects/projects.module.css"
import * as Select from "@radix-ui/react-select";




export default function TasksProject({tasks}) {

	if (!tasks || tasks?.length === 0) return <p>Aucune tâche pour ce projet.</p>;
	// useEffect(()=>{
	// 	if (!projectId)return;
	// 	const getTasksByProject = async () => {
	// 		try {
	// 			const response = await axios.get(
	// 				`http://localhost:8000/projects/${projectId}/tasks`,
	// 				{withCredentials:true}
	// 			);

	// 			// récupération des tâches par projet
	// 			setTasksByProject(response.data.data.tasks);

	// 		} catch (error) {
	// 			console.error("Erreur :", error);
	// 		}
	// 	};
	// 	getTasksByProject();
	// }, [projectId]);


	return (
		<>
			<section>
				<div>
					<h5>Tâches</h5> 
					<p>Par ordre de priorité</p>
				</div>
				<div>
					<button><FontAwesomeIcon icon={faListCheck}/>Liste</button>
					<button>Calendrier</button>
					<Select.Root>
						<Select.Trigger className={style.trigger} aria-label="statut">
							<Select.Value placeholder="Statut" />
							<Select.Icon className={style.icon}>
								<FontAwesomeIcon icon={faChevronDown}/>
							</Select.Icon>
						</Select.Trigger>
						<Select.Portal>
							<Select.Content className={style.content}>
								<Select.ScrollUpButton className={style.scrollButton}>
									<FontAwesomeIcon icon={faChevronUp}/>
								</Select.ScrollUpButton>
								<Select.Viewport className={style.viewport}>
									<Select.Group>
										<Select.Label className={style.label}>Statut</Select.Label>
										<Select.Item value="apple">A faire</Select.Item>
										<Select.Item value="banana">En cours</Select.Item>
										<Select.Item value="blueberry">Terminé</Select.Item>
									</Select.Group>
								</Select.Viewport>
								<Select.ScrollDownButton className={style.scrollButton}>
									<FontAwesomeIcon icon={faChevronDown}/>
								</Select.ScrollDownButton>
							</Select.Content>
						</Select.Portal>
					</Select.Root>
					{/* <label htmlFor={id}>rechercher une tâche</label>
					<input type="search" value={value} onChange={(e)=>setValue(e.target.value)}/>
					{isWaiting && <p>Loading...</p>} */}
					<FontAwesomeIcon icon={faMagnifyingGlass}/>
				</div>
			</section>


			<section>
				{tasks.map((tp)=>(
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
						{tp.assignees?.length > 0 ? (
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
						<Accordion.Root className={style.accordionRoot} type="single" collapsible>
							<Accordion.Item className={style.accordionItem} value={tp.id}>
								<Accordion.Header className={style.accordionHeader}>
									<Accordion.Trigger className={style.accordionTrigger}>
										<p>{tp.comments?.length> 1 ? "Commentaires": "Commentaire"} ({tp.comments?.length})</p>
										<FontAwesomeIcon className={style.accordionChevron} icon={faChevronUp} aria-hidden/>
									</Accordion.Trigger>
								</Accordion.Header>
								<Accordion.Content className={style.accordionContent}>
									{tp.comments?.length > 0 ? (
										tp.comments.map((c) => (
											<div key={c.id} className={style.accordionContentText}>
												<p>{c.content}</p>
												<small>{c.author?.name}</small>
											</div>
										))
									) : (
									<p className={style.accordionContentText}>Aucun commentaire</p>
									)}
								</Accordion.Content>
							</Accordion.Item>
						</Accordion.Root>
						</div>
					</div>
				</Link>

				))}
			</section>

		</>
	)
}