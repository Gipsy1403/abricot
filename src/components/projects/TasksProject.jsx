"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faListCheck, faMagnifyingGlass, faCalendarDays, faArrowLeftLong, faDiamond, faEllipsis} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback} from "react";
import axios from "axios";
import Link from "next/link";
import { statusLabels } from "@/utils/statusLabels";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { initialAvatar } from "@/utils/initialAvatar";
import * as Accordion from "@radix-ui/react-accordion";
import style from "@/app/styles/projects/projects.module.css"
import * as Select from "@radix-ui/react-select";
import ContributorsSelect from "@/utils/contributorsSelect";
import Tag from "@/utils/tags";
import Button from "../public/Button";
import useCurrentUser from "@/utils/hooks/useCurrentUser";
import { useProjectTasks } from "@/utils/hooks/useProjectTasks";
import ModalModifyTask from "./tasks/modals/ModalModifyTask";


export default function TasksProject({projectId}) {
	const { tasks, loading, error,refetch} = useProjectTasks(projectId);
	const { user} = useCurrentUser();
	
	const[viewMode,setViewMode]=useState("list");
	const[selectStatus,setSelectStatus]=useState("");

	const[commentsByTask, setCommentsByTask]=useState({});
	const [newComments, setNewComments ]=useState({});

	// Etat permettant d'ouvrir la modale pour modifier la tâche
	const [isOpen, setIsOpen] = useState(false);
	// Etat permettant de récupérer les données de la tâche à modifier
	const [selectedTaskId, setSelectedTaskId] = useState(null);

	
	const handleTaskUpdated = async () => {
  		await refetch();
	};
	
	// COMMENTAIRES - APPEL API POUR RECUPERER LES COMMENTAIRES
	const fetchComments = useCallback(
		async (taskId) => {
			if (commentsByTask[taskId]) return; // éviter de recharger
			try {
			const response = await axios.get(
				`http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments`,
				{ withCredentials: true }
			);
			if (response.data.success) {
				setCommentsByTask((prev) => ({
				...prev,
				[taskId]: response.data.data.comments,
				}));
			}
			} catch (err) {
				console.error("Erreur en récupérant les commentaires :", err);
			}
		},
	[projectId, commentsByTask]
	);

	
	useEffect(() => {
		if(!tasks)return;
		tasks.forEach(task => {
			fetchComments(task.id);
		});
	}, [tasks, fetchComments]);
	
	if (loading) return <p>Chargement...</p>;
	if (error) return <p>Erreur...</p>;

	if (!tasks || tasks?.length === 0) return <p>Aucune tâche pour ce projet.</p>;

	// COMMENTAIRES - APPEL API POUR ECRIRE DES COMMENTAIRES
	
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
	
	// Définir l'ordre : URGENT > HIGH > MEDIUM > LOW
	const priorityOrder = { URGENT:1, HIGH: 2, MEDIUM: 3, LOW: 4 };

	// Trier les tâches par priorité
	const sortedTasks = [...tasks].sort(
	(a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
	);

	const filteredTasks = (selectStatus
		? sortedTasks.filter(t => t.status === selectStatus)
		: sortedTasks
	);

	return (
		<>
		{/* CONTAINER DE TOUTES LES TACHES D UN PROJET */}
			<div className={style.containerTasks}>

				{/* BARRE DE RECHERCHE */}
				<section className={style.containerBarTasks}>
					<div className={style.tasks}>
						<h5>Tâches</h5>
						<p>Par ordre de priorité</p>
					</div>

					{/* par liste */}
					<div className={style.bar}>
						<p className={viewMode === "list" ? style.activeButton : ""} onClick={() => setViewMode("list")}>
							<FontAwesomeIcon icon={faListCheck}/> Liste</p>

						{/* par date */}
						<p className={viewMode === "calendar" ? style.activeButton : ""} onClick={() => setViewMode("calendar")}>
							<FontAwesomeIcon icon={faCalendarDays}/> Calendrier</p>

						{/*par statut*/}
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

						{/* par recherche */}
						<div className={style.taskSearch}>Rechercher une tâche <FontAwesomeIcon icon={faMagnifyingGlass}/></div>
					</div>
				</section>

				<section>
					{/* CARTE D UNE TACHE DU PROJET */}
					{tasks.map((tp)=>(
					<Link key={tp.id} href="#">
						<div className={style.card}>
							<div className={style.headerCard}>
								<div className={style.cardHeader}>
									<h5>{tp.title}</h5>
									<Tag className={style.status} type={statusLabels(tp.status)}/>
								</div>

								{/* BOUTON POUR MODIFIER OU SUPPRIMER UNE TACHE */}
								<DropdownMenu.Root>
      								{/* Le bouton*/}
									<DropdownMenu.Trigger asChild>
										<button>
											<FontAwesomeIcon className={style.etc} icon={faEllipsis}/>
										</button>
									</DropdownMenu.Trigger>
									{/* Le menu*/}
									<DropdownMenu.Portal>
										<DropdownMenu.Content className={style.contentMenu}>
											<DropdownMenu.Item className={style.itemMenu} onSelect={() => {
												setSelectedTaskId(tp.id);
												setIsOpen(true);
											}}>
											Modifier
											</DropdownMenu.Item>
											<DropdownMenu.Item className={`${style.itemMenu} ${style.deleteMenu}`} onClick={() => console.log("supprimer")}>
											Supprimer
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Portal>
								</DropdownMenu.Root>
							</div>
							<p className={style.description}>{tp.description}</p>
							<p className={style.date}>Echéance : <FontAwesomeIcon icon={faCalendarDays}/> {new Date(tp.dueDate).toLocaleDateString()}</p>
				
							<div className={style.containerAssigned}>
							Assigné à :{" "}
							{tp.assignees?.length > 0 ? (
							tp.assignees.map((a) => (
								<div key={a.user.id} className={style.assignedContainer}>
								<Avatar.Root >
									<Avatar.Fallback className={style.avatarAssigned}>{initialAvatar(a.user?.name)}</Avatar.Fallback>
								</Avatar.Root>
								<p className={style.nameAssigned}>{a.user.name}</p>
								</div>
							))
							) : (
							"Personne"
							)}
							</div>
							<div className={style.accordionWrapper}>
							<Accordion.Root className={style.accordionRoot} type="single" collapsible onValueChange={(value)=>{
								if(value && !commentsByTask[value]){
									fetchComments(value);
								}
							}}>
								<Accordion.Item className={style.accordionItem} value={tp.id}>
									<Accordion.Header className={style.accordionHeader}>
										<Accordion.Trigger className={style.accordionTrigger}>
											<p>{commentsByTask[tp.id]?.length> 1 ? "Commentaires": "Commentaire"} ({commentsByTask[tp.id]?.length || 0})</p>
											<FontAwesomeIcon className={style.accordionChevron} icon={faChevronUp}/>
										</Accordion.Trigger>
									</Accordion.Header>
									<Accordion.Content className={style.accordionContent}>
										{commentsByTask[tp.id]?.length > 0 ? (
											commentsByTask[tp.id].map((c) => (
												<div key={c.id} className={style.accordionContentText}>
													<div className={style.accordionAvatarText}>{initialAvatar(c.author?.name)}</div>
													<div className={style.accordionAuthorText}>
														<p className={style.nameAuthor} >{c.author?.name}</p>
														<p className={style.nameContent}>{c.content}</p>
													</div>
												</div>
												))
											) : (
											<p className={style.accordionContentText}>
											{commentsByTask[tp.id] ? "Aucun commentaire" : "Chargement..."}
											</p>
										)}
																												<div className={style.commentWrapper}>
											<div className={style.accordionUserText}>
												<p>{initialAvatar(user?.name)}</p>
												<textarea
													className={style.accordionInputText}
													type="text"
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
					{/* MODAL MODIFIER UNE TACHE */}
					{isOpen && (
						<ModalModifyTask
							open={isOpen}
							onClose={() => setIsOpen(false)}
							projectId={projectId}
							taskId={selectedTaskId}
							onTaskUpdated={handleTaskUpdated}
						/>
					)}
				</section>
			</div>
		</>
	)
}