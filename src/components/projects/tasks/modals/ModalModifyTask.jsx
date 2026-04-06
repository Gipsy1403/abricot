"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState,useEffect } from "react";
import axios from "axios";
import style from "@/app/styles/modals.module.css";
import ContributorsSelect from "@/utils/contributorsSelect";
import { formatDateToISO } from "@/utils/formatDateToIso";

export default function ModalModifyTask({onClose, projectId, taskId, onTaskUpdated}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [contributors, setContributors] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statuses = ["A faire","En cours","Terminée"];
  	const statusMap = {
		"A faire": "TODO",
		"En cours": "IN_PROGRESS",
		"Terminée": "DONE"
	};
useEffect(() => {
	const reverseStatusMap = {
  "TODO": "A faire",
  "IN_PROGRESS": "En cours",
  "DONE": "Terminée"
};

const fetchTask = async () => {
	if (!projectId || !taskId) return;
	console.log("Fetch task", projectId, taskId);
	try {
		const res = await axios.get(
			`http://localhost:8000/projects/${projectId}/tasks/${taskId}`,
			{ withCredentials: true }
		);
		
		const task = res.data?.data?.task;
		
		setTitle(task.title || "");
		setDescription(task.description || "");
		setDueDate(task.dueDate?.split("T")[0] || "");
		setContributors(task.assignees?.map(a => a.userId) || []);
		setStatus(reverseStatusMap[task.status] || "");


    } catch (err) {
      console.error("Erreur chargement tâche", err);
    }
  };

  fetchTask();
}, [projectId, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
	const dueDateISO=formatDateToISO(dueDate); 

      const response = await axios.put(`http://localhost:8000/projects/${projectId}/tasks/${taskId}`, {
        title,
        description,
	   dueDate:dueDateISO,
        assigneeIds:contributors,
	   status:statusMap[status],
      }, { withCredentials: true });

      console.log("tache modifiée :", response.data);
	 onTaskUpdated(response.data.data.task);
     onClose();

    } catch (err) {
    const message =
      err?.response?.data?.details?.[0]?.message ||
      err?.response?.data?.message ||
      err?.message ||
      "Erreur serveur";

    console.error(err);
    setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
		<Dialog.Root open={true}>
			<Dialog.Portal>
			<Dialog.Overlay className={style.overlay} onClick={onClose} />
			<Dialog.Content className={style.content}>
				<Dialog.Title>Modifier une tâche</Dialog.Title>

				{error && <p style={{ color: "red" }}>{error}</p>}

				<form onSubmit={handleSubmit}>
					<div className={style.field}>
						<label className={style.label} htmlFor="title">Titre*</label>
						<input
							className={style.input}
							id="title"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					<div className={style.field}>
						<label className={style.label} htmlFor="description">Description</label>
						<textarea
							className={style.input}
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required

						/>
					</div>

					<div className={style.field}>
						<label className={style.label} htmlFor="dueDate">Echéance</label>
						<input
							className={style.input}
							type="date"
							id="dueDate"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							required

						/>
					</div>

					<div className={style.field}>
						<label className={style.label}>Assigné à : </label>
						<ContributorsSelect
							value={contributors}
							onChange={setContributors}
						/>
					</div>

					<div className={style.field}>
						<label className={style.label} htmlFor="status">Statut</label>
						{statuses.map((s) => (
							<button
								className={`${style.btnStatus} ${status === s ? style.active : ""}`}
								key={s}
								type="button"
								// onClick={() => setStatus(s)}
								onClick={() => {
									console.log("Status choisi :", s); // <--- vérifie ici
									setStatus(s);
								}}
							>
							{s}
							</button>
						))}
					</div>
					<button type="submit" disabled={loading}>
						{loading ? "Modification..." : "Enregistrer"}
					</button>
				</form>

				<Dialog.Close asChild>
				<button className={style.closeButton} aria-label="Close" onClick={onClose}>X</button>
				</Dialog.Close>
			</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}