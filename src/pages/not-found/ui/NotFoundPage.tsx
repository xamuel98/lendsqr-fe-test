import { Link } from "react-router-dom";

import { routePaths } from "@app/router";

import styles from "./NotFoundPage.module.scss";

export function NotFoundPage() {
  return (
    <main className={styles.page} id="main-content">
      <section className={styles.panel}>
        <p className={styles.eyebrow}>Fallback Route</p>
        <h1>Page Not Found</h1>
        <p>The requested route does not exist in the application yet.</p>
        <Link className={styles.link} to={routePaths.login}>
          Return to login
        </Link>
      </section>
    </main>
  );
}
