
import { useState, useEffect } from "react";
import axios from "axios";

export default function ContributorsSelect({ value, onChange }) {
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
	if (search.length < 2) return;
	console.log("Recherche en cours pour :", search);
	const fetchUsers = async () => {
		try {
		const res = await axios.get(
			`http://localhost:8000/users/search?query=${search}`,
			{ withCredentials: true }
		);
			console.log("Réponse API :", res.data);
			setUsers(prevUsers => {
		const newUsers = res.data.data.users.filter(
			user => !prevUsers.some(u => u.id === user.id)
		);
		return [...prevUsers, ...newUsers];
		});
		} catch (err) {
		console.error("Erreur users :", err.response?.status, err.response?.data);
		}
	};
	fetchUsers();
	}, [search]);

	return (
		<div>
			{/* Input de recherche */}
			<input
			type="text"
			placeholder="Rechercher un ou plusieurs collaborateurs"
			value={search}
			onChange={(e) => setSearch(e.target.value)}
			/>

			{/* Select multiple */}
			<select
			multiple
			value={value}
			onChange={(e) => {
				const selected = [];
				for (let option of e.target.options) {
				if (option.selected) {
				selected.push(option.value);
				}
				}
				console.log("Utilisateurs sélectionnés :", selected); 
				onChange(selected);
			}}

			>
			{users.map((user) => (
				<option key={user.id} value={user.id}>
				{/* <option key={user.id} value={user.email}> */}
				{user.name} {user.email} 
				</option>
			))}
			</select>
		</div>
	);
}