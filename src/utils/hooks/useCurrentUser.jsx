"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function useCurrentUser() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// fonction réutilisable
	const fetchUser = async () => {
		try {
			setLoading(true);

			const response = await axios.get(
				"http://localhost:8000/auth/profile",
				{ withCredentials: true }
			);

			if (response.data.success) {
				setUser(response.data.data.user);
			} else {
				setError("Erreur API");
			}
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	// appelé au début
	useEffect(() => {
		fetchUser();
	}, []);

	// on expose la fonction
	return { user, loading, error, refreshUser: fetchUser };
}