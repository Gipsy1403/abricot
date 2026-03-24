import Image from "next/image"
import style from "@/app/styles/headerAndFooter.module.css"

export default function Footer() {
	return (
		<footer className={style.footer}>
			<Image
				src={"/images/Logo-black.png"}
				alt="Logo Abricot"
				width={147}
				height={19}
			/>
			<p>Abricot 2025</p>
		</footer>
	)
}