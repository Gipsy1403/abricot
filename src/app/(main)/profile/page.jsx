"use client"

import { useEffect, useState } from "react";
import style from "@/app/styles/auth/profile.module.css"
import axios from "axios";
import { useRouter } from "next/navigation";
import Button from "@/components/public/Button";

export default function Profile() {
	const router = useRouter();

	// profil
	const [firstName, setFirstName] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	// password update
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/auth/profile",
					{ withCredentials: true }
				);

				const user = response.data.data.user;

				if (user.name) {
					const parts = user.name.split(" ");
					setFirstName(parts[0]);
					setName(parts.slice(1).join(" "));
				}

				setEmail(user.email || "");
			} catch (error) {
				setMessage(
					error.response?.data?.message || "Impossible de récupérer le profil"
				);
			}
		};

		fetchProfile();
	}, []);

	const handleProfile = async (e) => {
		e.preventDefault();

		try {
			const allName = `${firstName} ${name}`.trim();

			// 1. update profil
			await axios.put(
				"http://localhost:8000/auth/profile",
				{ name: allName, email },
				{ withCredentials: true }
			);

			// 2. update password si rempli
			if (currentPassword || newPassword) {

				if (newPassword !== confirmPassword) {
					setMessage("Les mots de passe ne correspondent pas");
					return;
				}

				await axios.put(
					"http://localhost:8000/auth/password",
					{
						currentPassword,
						newPassword
					},
					{ withCredentials: true }
				);
			}

			window.location.href = "/dashboard";

		} catch (error) {
			const errors = error.response?.data?.data?.errors;

			if (errors && errors.length > 0) {
				setMessage(errors.map(err => `${err.field}: ${err.message}`).join(" | "));
			} else {
				setMessage(
					error.response?.data?.message || "Erreur lors de la modification du compte"
				);
			}
		}
	};

	return (
		<section className={style.containerProfile}>
			<h5>Mon compte</h5>
			<p>{firstName} {name}</p>

			<form onSubmit={handleProfile}>

				{/* 👤 PROFILE */}
				<div className={style.field}>
					<label>Prénom</label>
					<input
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>

				<div className={style.field}>
					<label>Nom</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>

				<div className={style.field}>
					<label>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				{/* PASSWORD */}
				<h4 style={{ marginTop: "20px" }}>Changer le mot de passe</h4>

				<div className={style.field}>
					<label>Mot de passe actuel</label>
					<input
						type="password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
					/>
				</div>

				<div className={style.field}>
					<label>Nouveau mot de passe</label>
					<input
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
				</div>

				<div className={style.field}>
					<label>Confirmer mot de passe</label>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>

				<Button text="Modifier les informations" disabled={false} />
			</form>

			{message && <p>{message}</p>}
		</section>
	);
}