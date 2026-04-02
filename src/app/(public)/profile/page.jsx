"use client"
import { useEffect, useState } from "react";
import style from "@/app/styles/auth/profile.module.css"
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Profile() {
	const router=useRouter()
	const [firstName, setFirstName] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	useEffect(()=>{
		const fetchProfile=async()=>{
			try{
				const response=await axios.get(
					"http://localhost:8000/auth/profile",
					{withCredentials:true}
				);
				const user=response.data.data.user;
				if(user.name) {
					const parts=user.name.split(" ");
					setFirstName(parts[0]);
					setName(parts.slice(1).join(" "));
				}
				setEmail(user.email || "");
			}catch(error){
				console.error("Erreur lors de la récupération du profil :", error);
				setMessage(
					error.response?.data?.message || "Impossible de récupérer le profil"
				);
			}
		};
		fetchProfile();
	},[])

	const handleProfile = async (e) => {
	e.preventDefault();
		
		try {
			const allName=`${firstName} ${name}`.trim();

			const response = await axios.put(
				"http://localhost:8000/auth/profile",
				{name: allName, email},
				{withCredentials: true}
			);
	
			setMessage(response.data.message);
			
			router.push("/dashboard")
		} catch (error) {
		// On récupère les erreurs venant du back
			const errors = error.response?.data?.data?.errors;

			if (errors && errors.length > 0) {
				// Affiche toutes les erreurs détaillées
				setMessage(errors.map(err => `${err.field}: ${err.message}`).join(" | "));
			} else {
				// Sinon, affiche le message général
				setMessage(
					error.response?.data?.message || "Erreur lors de la modification du compte"
				);
			}
		}
	};
	return (
		<>
			<h5>Mon compte</h5>
			<p>{firstName} {name}</p>
			<form onSubmit={handleProfile} >
				<div className={style.firstname}>
					<label htmlFor="firstname" id="firstname">Prénom</label>
					<input
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>
				<div className={style.name}>
					<label htmlFor="name" id="name">Nom</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
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
				<button type="submit">Modifier les informations</button>
			</form>
		</>
	)
}