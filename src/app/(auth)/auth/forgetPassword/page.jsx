"use client"
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import style from "../../../styles/auth/logAndSign.module.css";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
	 const response = await axios.post(
	   "http://localhost:8000/auth/forget-password",
	   { email }
	 );

	 setIsSuccess(true);
	 setMessage(response.data.message || "Un email de réinitialisation a été envoyé.");
    } catch (error) {
	 setIsSuccess(false);
	 const errors = error.response?.data?.data?.errors;

	 if (errors && errors.length > 0) {
	   setMessage(errors.map((err) => `${err.field}: ${err.message}`).join(" | "));
	 } else {
	   setMessage(
		error.response?.data?.message || "Erreur lors de l'envoi de l'email."
	   );
	 }
    } finally {
	 setIsLoading(false);
    }
  };

  return (
    <div className={style.background_login}>
	 <form className={style.form} onSubmit={handleForgetPassword}>
	   <Image
		src={"/images/Union.png"}
		alt="Logo Abricot - Page Accueil"
		className={style.logo}
		width={252}
		height={32}
	   />
	   <h1>Mot de passe oublié</h1>
	   <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
		Renseignez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
	   </p>

	   <div className={style.email}>
		<label htmlFor="email">Email</label>
		<input
		  id="email"
		  type="email"
		  value={email}
		  onChange={(e) => setEmail(e.target.value)}
		  required
		/>
	   </div>

	   <button type="submit" disabled={isLoading}>
		{isLoading ? "Envoi en cours..." : "Envoyer le lien"}
	   </button>

	   <Link href="/">Retour à la connexion</Link>

	   {message && (
		<p style={{ color: isSuccess ? "green" : "red", textAlign: "center" }}>
		  {message}
		</p>
	   )}
	 </form>
    </div>
  );
}
