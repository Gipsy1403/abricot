"use client"
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import style from "@/app/styles/authentification/logAndSign.module.css"

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fonction appelée au submit
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
	    const response = await axios.post(
		    "http://localhost:8000/auth/login",
		    { email, password},
		    {
			    withCredentials: true, // cookies
			}
		);
		
		setMessage(response.data.message);
		
		//rediction vers le dasboard
		// router.push("/dashboard")

	} catch (error) {
		setMessage(
			error.response?.data?.message || "Erreur lors de la connexion"
		);
	}
};
  return (
	<div className={style.background_login}>
		<form className={style.form} onSubmit={handleLogin}>
				<h2>Connexion</h2>
				<div className={style.email}>
					<label htmlFor="email" id="email">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className={style.password}>
					<label htmlFor="password" id="password">Mot de passe</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit">Se connecter</button>
		
				<Link href="/authentification/forgetPassword">Mot de passe oublié ?</Link>
				<p>Pas encore de compte ? <Link href="/authentification/register">Créer un compte</Link></p>
		
				{message && <p>{message}</p>}
		</form>
	</div>
  );
}