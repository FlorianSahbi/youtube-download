
import styles from "./page.module.css";
import Player from "@/components/page";

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Player />
      </main>
    </div>
  );
}
