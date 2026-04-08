"use client";

import { useParams } from "next/navigation";
import Tag from "@/utils/tags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp} from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons/faCalendarDays";
import * as Avatar from "@radix-ui/react-avatar";
import * as Accordion from "@radix-ui/react-accordion";
import Button from "@/components/public/Button";
import { useTask } from "@/utils/hooks/useTask";
import { statusLabels } from "@/utils/statusLabels";
import style from "@/app/styles/task/task.module.css";
import { initialAvatar } from "@/utils/initialAvatar";
import useCurrentUser from "@/utils/hooks/useCurrentUser";
import { useComments } from "@/utils/hooks/useComments";

export default function TaskPage() {
  const params = useParams();
  const projectId = params.projectId;
  const taskId = params.taskId;

  // 🔹 Hooks
  const { task, loading: loadingTask, error: errorTask } = useTask(projectId, taskId);
  const { user, loading: loadingUser, error: errorUser } = useCurrentUser();
  const {
    commentsByTask,
    newComments,
    setNewComments,
    fetchComments,
    addComment,
    loading: loadingComments,
    error: errorComments
  } = useComments(projectId);

  // 🔹 Fonction pour ajouter un commentaire
  const handleAddComment = (taskId) => {
    addComment(taskId);
  };

  // 🔹 Gestion des états de chargement et d’erreur
  if (loadingTask || loadingUser) return <p>Chargement...</p>;
  if (errorTask) return <p>Erreur tâche : {errorTask}</p>;
  if (errorUser) return <p>Erreur utilisateur : {errorUser}</p>;
  if (!task) return <p>Aucune tâche trouvée</p>;

  const tp = task;

	return (
		<section className={style.containerTask}>
			{/* En-tête de la tâche */}
			<div className={style.cardHeader}>
				<h5>{tp.title}</h5>
				<Tag className={style.status} type={statusLabels(tp.status)} />
			</div>

			{/* Description et date */}
			<p className={style.description}>{tp.description}</p>
			<p className={style.date}> Échéance : <FontAwesomeIcon icon={faCalendarDays} /> {new Date(tp.dueDate).toLocaleDateString()}
			</p>

			{/* Assignés */}
			<div className={style.containerAssigned}>
				Assigné à :{" "}
				{tp.assignees?.length > 0 ? (
					tp.assignees.map((a) => (
					<div key={a.user.id} className={style.assignedContainer}>
					<Avatar.Root>
						<Avatar.Fallback className={style.avatarAssigned}>{initialAvatar(a.user?.name)}</Avatar.Fallback>
					</Avatar.Root>
					<p className={style.nameAssigned}>{a.user.name}</p>
					</div>
					))
				) : (
					"Personne"
				)}
			</div>

			{/* Commentaires */}
			<div className={style.accordionWrapper}>
				<Accordion.Root
					className={style.accordionRoot}
					type="single"
					collapsible
					defaultValue={tp.id}
					onValueChange={(value) => {
					if (value && !commentsByTask[value]) {
					fetchComments(value);
					}
					}}
				>
					<Accordion.Item className={style.accordionItem} value={tp.id}>
						<Accordion.Header className={style.accordionHeader} >
							<Accordion.Trigger className={style.accordionTrigger}>
								<p>{commentsByTask[tp.id]?.length > 1 ? "Commentaires" : "Commentaire"} ({commentsByTask[tp.id]?.length || 0})</p>
								<FontAwesomeIcon className={style.accordionChevron} icon={faChevronUp} />
							</Accordion.Trigger>
						</Accordion.Header>

					<Accordion.Content className={style.accordionContent}>
						{loadingComments && !commentsByTask[tp.id] ? (
							<p className={style.accordionContentText}>Chargement...</p>
						) : commentsByTask[tp.id]?.length > 0 ? (
							commentsByTask[tp.id].map((c) => (
							<div key={c.id} className={style.accordionContentText}>
								<div className={style.accordionAvatarText}>{initialAvatar(c.author?.name)}</div>
								<div className={style.accordionAuthorText}>
								<p className={style.nameAuthor}>{c.author?.name}</p>
								<p className={style.nameContent}>{c.content}</p>
								</div>
							</div>
							))
						) : (
							<p className={style.accordionContentText}>Aucun commentaire</p>
						)}

					{/* Ajouter un commentaire */}
					<div className={style.commentWrapper}>
						<div className={style.accordionUserText}>
						<p>{initialAvatar(user?.name)}</p>
						<textarea
							className={style.accordionInputText}
							placeholder="Ajouter un commentaire..."
							value={newComments[tp.id] || ""}
							onChange={(e) =>
							setNewComments((prev) => ({ ...prev, [tp.id]: e.target.value }))
							}
						/>
						</div>
						<Button onClick={() => handleAddComment(tp.id)} className={style.accordionBtnSend} text="Envoyer" />
					</div>
					</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</div>
		</section>
	);
}