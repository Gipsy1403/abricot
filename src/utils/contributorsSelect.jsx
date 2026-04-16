import AsyncSelect from "react-select/async";
import axios from "axios";

export default function ContributorsSelect({ value, onChange }) {

  // Fonction qui charge les options dynamiquement
  const loadOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];
    try {
      const res = await axios.get(
        `http://localhost:8000/users/search?query=${inputValue}`,
        { withCredentials: true }
      );
      return res.data.data.users.map((user) => ({
     //    value: user.email,
     //    label: `${user.name} — ${user.email}`,
	  value: user.id,           // ce qu’on envoie pour les tâches
  label: `${user.name} — ${user.email}`, // ce qu’on affiche
  email: user.email,        // utile si projet a besoin de l'email
  id: user.id  
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  return (
<AsyncSelect
  isMulti
  cacheOptions
  defaultOptions={[]} 
  loadOptions={loadOptions}
  value={value || []} // maintenant un tableau d'objets {value, label}
  onChange={(selected) =>
    // on renvoie uniquement les emails au parent
//     onChange(selected ? selected.map((s) => s.value) : [])
	onChange(selected || [])
  }
  placeholder="Rechercher des collaborateurs..."
  noOptionsMessage={() => "Tape au moins 2 lettres"}
/>
  );
}