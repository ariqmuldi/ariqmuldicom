import Link from 'next/link';
import styles from '../adzra.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

// The sticky top bar shared by every detail page: back-to-collection link + the entry number.
export default function DetailTopBar({ no }: { no: number }) {
	return (
		<div className={styles.topBar}>
			<Link href="/adzra" className={styles.backLink}>
				‹ collection
			</Link>
			<span className={styles.topNo}>NO. {pad(no)}</span>
		</div>
	);
}
