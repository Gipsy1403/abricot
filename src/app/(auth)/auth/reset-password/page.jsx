"use client"
import React, { useState, use } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import style from "@/app/styles/auth/logAndSign.module.css";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function ResetPassword({ searchParams }) {
  const router = useRouter();

  // Next.js 15 : searchParams est une Promise, il faut l'unwrapper avec React.use()
//   const resolvedParams = use(searchParams);
//   const token = resolvedParams?.token || null;

const searchParamsHook = useSearchParams();
const token = searchParamsHook.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    console.log("token :", token);

    if (password !== confirmPassword) {
      setIsSuccess(false);
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!token) {
      setIsSuccess(false);
      setMessage("Token de réinitialisation manquant ou invalide.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/reset-password",
        { token, newPassword: password }
      );

      setIsSuccess(true);
      setMessage(response.data.message || "Mot de passe réinitialisé avec succès.");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setIsSuccess(false);
      const errors = error.response?.data?.data?.errors;

      if (errors && errors.length > 0) {
        setMessage(errors.map((err) => `${err.field}: ${err.message}`).join(" | "));
      } else {
        setMessage(
          error.response?.data?.message || "Erreur lors de la réinitialisation."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.background_login}>
      <form className={style.form} onSubmit={handleResetPassword}>
        <Image
          src={"/images/Union.png"}
          alt="Logo Abricot - Page Accueil"
          className={style.logo}
          width={252}
          height={32}
        />
        <h1>Nouveau mot de passe</h1>
        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
          Choisissez un nouveau mot de passe sécurisé.
        </p>

        <div className={style.password}>
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={style.password}>
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
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
