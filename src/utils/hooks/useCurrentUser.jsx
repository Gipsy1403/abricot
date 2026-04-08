"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function useCurrentUser() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
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

		fetchUser();
	}, []);

	return { user, loading, error };
}