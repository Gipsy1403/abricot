"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import style from "@/app/styles/modals.module.css";
import ContributorsSelect from "@/utils/contributorsSelect";
import Button from "@/components/public/Button";
import useCurrentUser from "@/utils/hooks/useCurrentUser";

export default function ModalCreateProject({onClose, onProjectCreated}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user} = useCurrentUser();
  
  useEffect(() => {
    	if (!user || !user.email) return;
	if (user) {
		setContributors([
			{
			value: user.id, // important
			label: `${user.name} — ${user.email}`, // affichage
			email: user.email,
			id: user.id,
			},
		]);
	}
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

	try {
		console.log("DATA ENVOYÉE :", {
		  name:title,
		  description,
		contributors:contributors.map(c => c.email),
		});
		const response = await axios.post("http://localhost:8000/projects", {
			name:title,
			description,
			contributors:contributors.map(c => c.email),
			}, { withCredentials: true });

		console.log("reponse API :", response.data);
		onProjectCreated(response.data.data.project)

		//reset du formulaire
		setTitle("");
		setDescription("");
		setContributors([]);
		onClose();
	} catch (err) {
		//  console.error(err);
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
  const formInvalid = title.trim() === "" || description.trim() === "";

  return (
	<Dialog.Root open={true}>
		<Dialog.Portal>
		<Dialog.Overlay className={style.overlay} onClick={onClose} />
		<Dialog.Content className={style.content}>
			<p className={style.closeButton} aria-label="Close" onClick={onClose}>X</p>

			<Dialog.Title className={style.title}>Créer un projet</Dialog.Title>

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
					<label className={style.label} htmlFor="description">Description*</label>
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
				<Button text="Ajouter un projet" disabled={loading|| formInvalid}
				/>
			</form>
			<Dialog.Close asChild></Dialog.Close>
		</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	);
}