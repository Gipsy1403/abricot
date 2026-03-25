import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image"
import Link from "next/link"
import style from "@/app/styles/headerAndFooter.module.css"

export default function Header() {
	return (
		<header>
			<nav className={style.nav}>
				<Image
					src={"/images/Logo-orange.png"}
					alt="Logo Abricot - Page Accueil"
					width={147}
					height={19}
				/>
				<ul>
					<li><Link href="/dashboard">
						<Image
							src={"/images/icon-dashboard_orange.png"}
							alt="Logo Abricot - Page Accueil"
							width={24}
							height={24}
						/>
						Tableau de Bord</Link>
					</li>
					<li><Link href="/projects">
						<FontAwesomeIcon icon={faFolderOpen}/>
						Projets</Link>
					</li>
				</ul>
				<div>
					<Link href="/auth/profile">avatar</Link>
				</div>
			</nav>
		</header>
	)
}