"use client"
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import style from "../../../styles/auth/logAndSign.module.css";
import { useRouter } from "next/navigation";

export default function Register() {
  const router=useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fonction appelée au submit
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/register",
        { email, password},
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message);

	// Redirection au formulaire du profil
	 router.push("/profile")

	} catch (error) {
	// On récupère les erreurs venant du back
		const errors = error.response?.data?.data?.errors;

		if (errors && errors.length > 0) {
			// Affiche toutes les erreurs détaillées
			setMessage(errors.map(err => `${err.field}: ${err.message}`).join(" | "));
		} else {
			// Sinon, affiche le message général
			setMessage(
				error.response?.data?.message || "Erreur lors de l'inscription"
			);
		}
	}
  };

  return (
	<div className={style.background_register}>
		<form className={style.form} onSubmit={handleRegister}>
			<Image
				src={"/images/Union.png"}
				alt="Logo Abricot - Page Accueil"
				className={style.logo}
				width={252}
				height={32}
			/>
			<h1>Inscription</h1>

				<div className={style.email}>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className={style.password}>
					<label htmlFor="password">Mot de passe</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{/* <Link href="/profile"> */}
					<button type="submit">S&#39;inscrire</button>
				{/* </Link> */}
		
				<p>Déjà inscrit ? <Link href="/">Se connecter</Link></p>
		
				{message && <p>{message}</p>}
		</form>
	</div>
  );
}