"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import style from "@/app/styles/modals.module.css";
import ContributorsSelect from "@/utils/contributorsSelect";

export default function ModalModifyProject({onClose, project, onProjectUpdated}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

//   useEffect(() => {
//   if (project) {
//     setTitle(project.name || "");
//     setDescription(project.description || "");
//     setContributors(project.members?.map((m) => ({ id: m.user.id, name: m.user.name })) || []);
//   }
// }, [project]);
useEffect(() => {
  if (project) {
    setTitle(project.name || "");
    setDescription(project.description || "");
    setContributors(
      project.members?.map((m) => ({
     //    value: m.user.email,
	   value: m.user.id,
        label: `${m.user.name} — ${m.user.email}`
      })) || []
    );
  }
}, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      const response = await axios.put(`http://localhost:8000/projects/${project.id}`, {
        name:title,
        description,
        contributors:contributors.map(c => c.value),
      }, { withCredentials: true });

  
	//  Mise à jour du projet dans le parent
     if (onProjectUpdated) {
		// reconstruire le tableau members pour le front
      const updatedProject = {
        ...response.data.data.project,
        members: contributors.map(c => ({
          user: {
            id: c.value, // optionnel, sinon tu peux garder l'id original si tu l'as
            name: c.label.split(" — ")[0], // extraire le nom du label
            email: c.value
          }
        }))
      };
	   onProjectUpdated(updatedProject);
     //    onProjectUpdated(response.data.data.project);
	console.log("projet modifié: ", updatedProject)
	  }
     onClose();

    } catch (err) {
     //  console.error(err);
     //  setError("Erreur lors de la création du projet.");
  if (err.response) {
    console.log("DETAIL DES ERREURS :", err.response.data.data.errors);

    setError(
      err.response.data.data.errors[0]?.message ||
      "Erreur serveur"
    );
  } else {
    setError("Erreur réseau");
  }
    } finally {
      setLoading(false);
    }
  };

  return (
	<Dialog.Root open={true}>
		<Dialog.Portal>
		<Dialog.Overlay className={style.overlay} onClick={onClose} />
		<Dialog.Content className={style.content}>
			<Dialog.Title>Modifier le projet</Dialog.Title>

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
					<label className={style.label}>Contributeurs</label>
					<ContributorsSelect
						value={contributors}
						onChange={setContributors}
					/>
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