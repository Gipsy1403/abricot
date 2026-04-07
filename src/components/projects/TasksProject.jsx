"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass, faCalendarDays, faArrowLeftLong, faDiamond} from "@fortawesome/free-solid-svg-icons";
import { useState} from "react";
import axios from "axios";
import Link from "next/link";
import { statusLabels } from "@/utils/statusLabels";
import * as Avatar from "@radix-ui/react-avatar";
import { initialAvatar } from "@/utils/initialAvatar";
import * as Accordion from "@radix-ui/react-accordion";
import style from "@/app/styles/projects/projects.module.css"
import * as Select from "@radix-ui/react-select";
import ContributorsSelect from "@/utils/contributorsSelect";
import Tag from "@/utils/tags";
import Button from "../public/Button";




export default function TasksProject({tasks, projectId}) {
	const[viewMode,setViewMode]=useState("list");
	
	const[selectStatus,setSelectStatus]=useState("");
	const[commentsByTask, setCommentsByTask]=useState({});
	const [newComments, setNewComments ]=useState({});

	const fetchComments = async (taskId) => {
		try {
		const response = await axios.get(
			`http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments`,
			{withCredentials: true}
		);
			if (response.data.success) {
				setCommentsByTask(prev => ({
				...prev,
				[taskId]: response.data.data.comments
				}));
			} else {
				console.error(response.data.message);
			}
		} catch (error) {
			console.error("Erreur en récupérant les commentaires:", error);
		}
	};

	const handleAddComment = async (taskId) => {
		const content = newComments[taskId];
		if (!content?.trim()) return;
		try {
		const response = await axios.post(
			`http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments`,
			{ content },
			{withCredentials: true}
		);
			if (response.data.success) {
				setCommentsByTask(prev => ({
				...prev,
				[taskId]: [...(prev[taskId] || []), response.data.data.comment]
				}));
				setNewComments(prev => ({ ...prev, [taskId]: "" }));
			}
		} catch (error) {
			console.error("Erreur en ajoutant le commentaire:", error);
		}
	};

	const statusOptions = [
		["TODO", statusLabels("TODO")],
		["IN_PROGRESS", statusLabels("IN_PROGRESS")],
		["DONE", statusLabels("DONE")]
	];

	if (!tasks || tasks?.length === 0) return <p>Aucune tâche pour ce projet.</p>;

	return (
		<>
			<div className={style.containerTasks}>
				<section className={style.containerBarTasks}>
					<div className={style.tasks}>
						<h5>Tâches</h5>
						<p>Par ordre de priorité</p>
					</div>

					<div className={style.bar}>
						<p className={viewMode === "list" ? style.activeButton : ""} onClick={() => setViewMode("list")}>
							<FontAwesomeIcon icon={faListCheck}/> Liste</p>

						<p className={viewMode === "calendar" ? style.activeButton : ""} onClick={() => setViewMode("calendar")}>
							<FontAwesomeIcon icon={faCalendarDays}/> Calendrier</p>

						<Select.Root value={selectStatus} onValueChange={setSelectStatus}>
							<Select.Trigger className={style.trigger} aria-label="statut">
								<Select.Value placeholder="Statut" />
								<Select.Icon className={style.icon}>
									<FontAwesomeIcon icon={faChevronDown}/>
								</Select.Icon>
							</Select.Trigger>
							<Select.Portal>
								<Select.Content className={style.content} position="popper">
									<Select.ScrollUpButton className={style.scrollButton}>
										<FontAwesomeIcon icon={faChevronUp}/>
									</Select.ScrollUpButton>
									<Select.Viewport className={style.viewport}>
										<Select.Group>
											<Select.Label className={style.label}></Select.Label>
											{statusOptions.map(([value, label]) => (
												<Select.Item key={value} value={value} className={style.item}>
													<Select.ItemText>{label}</Select.ItemText>
													<Select.ItemIndicator />
												</Select.Item>
											))}
										</Select.Group>
									</Select.Viewport>
									<Select.ScrollDownButton className={style.scrollButton}>
										<FontAwesomeIcon icon={faChevronDown}/>
									</Select.ScrollDownButton>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
						<div className={style.taskSearch}>Rechercher une tâche <FontAwesomeIcon icon={faMagnifyingGlass}/></div>
					</div>
				</section>
				<section>
					{tasks.map((tp)=>(
					<Link key={tp.id} href="">
						<div className={style.card}>
							<div className={style.cardHeader}>
								<h5>{tp.title}</h5>
								<Tag className={style.status} type={statusLabels(tp.status)}/>
							</div>
							<p className={style.description}>{tp.description}</p>
							<p className={style.date}>Echéance : <FontAwesomeIcon icon={faCalendarDays}/> {new Date(tp.dueDate).toLocaleDateString()}</p>
							{/* <p>Assigné à : {""} {tp.assignees.length > 0 ? tp.assignees.map((a) => a.user.name).join(", ") : "Personne"}</p> */}
				
							<p className={style.assignees}>
							Assigné à :{" "}
							{tp.assignees?.length > 0 ? (
							tp.assignees.map((a) => (
								<span key={a.user.id} className={style.assignee}>
								<Avatar.Root className={style.avatar}>
									<Avatar.Fallback>{initialAvatar(a.user?.name)}</Avatar.Fallback>
								</Avatar.Root>
								{a.user.name}
								</span>
							))
							) : (
							"Personne"
							)}
							</p>
							<div className={style.accordionWrapper}>
							<Accordion.Root className={style.accordionRoot} type="single" collapsible onValueChange={(value)=>{
								if(value && !commentsByTask[value]){
									fetchComments(value);
								}
							}}>
								<Accordion.Item className={style.accordionItem} value={tp.id}>
									<Accordion.Header className={style.accordionHeader}>
										<Accordion.Trigger className={style.accordionTrigger}>
											<p>{tp.comments?.length> 1 ? "Commentaires": "Commentaire"} ({tp.comments?.length || 0})</p>
											<FontAwesomeIcon className={style.accordionChevron} icon={faChevronUp}/>
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Content className={style.accordionContent}>
										{commentsByTask[tp.id]?.length > 0 ? (
											commentsByTask[tp.id].map((c) => (
												<div key={c.id} className={style.accordionContentText}>
													<div className={style.accordionAvatarText}>{initialAvatar(c.author?.name)}</div>
													<div className={style.accordionAuthorText}>
														<small>{c.author?.name}</small>
														<p>{c.content}</p>
													</div>
												</div>
												))
											) : (
											<p className={style.accordionContentText}>
											{commentsByTask[tp.id] ? "Aucun commentaire" : "Chargement..."}
											</p>
										)}
																												<div>
											<div className={style.accordionUserText}>
												<p>{initialAvatar()}</p>
												<input
													className={style.accordionInputText}
													type="texterea"
													placeholder="Ajouter un commentaire..."
													value={newComments[tp.id] || ""}
													onChange={(e) =>
													setNewComments(prev => ({ ...prev, [tp.id]: e.target.value }))
													}
												/>
											</div>
										<Button onClick={() => handleAddComment(tp.id)} className={style.accordionBtnSend} text="Envoyer"/>
										</div>
									</Accordion.Content>
								</Accordion.Item>
							</Accordion.Root>
							</div>
						</div>
					</Link>
					))}
				</section>
			</div>
		</>
	)
}