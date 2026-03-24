"use client"
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import style from "@/app/styles/authentification/logAndSign.module.css"

export default function Register() {
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
          withCredentials: true, // cookies
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Erreur lors de l'inscription"
      );
    }
  };

  return (
	<div className={style.background_register}>
		<form className={style.form} onSubmit={handleRegister}>
				<h2>Inscription</h2>
				<div className={style.email}>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className={style.password}>
					<label htmlFor="passeword">Mot de passe</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit">S'inscrire</button>
		
				<p>Déjà inscrit ? <Link href="/authentification/login">Se connecter</Link></p>
		
				{message && <p>{message}</p>}
		</form>
	</div>
  );
}