import { Link } from "react-router-dom";

import { routePaths } from "@app/router";
import brokenSiteImage from "@shared/assets/images/broken-site.svg";

import styles from "./ProtectedNotFoundPage.module.scss";

export function ProtectedNotFoundPage() {
  return (
    <section
      aria-labelledby="protected-not-found-title"
      className={styles.page}
    >
      <div className={styles.content}>
        <img alt="" className={styles.illustration} src={brokenSiteImage} />
        <p aria-hidden="true" className={styles.code}>
          404
        </p>
        <h1 className={styles.title} id="protected-not-found-title">
          Page Not Found
        </h1>
        <p className={styles.description}>
          The page you are looking for does not exist or may have moved.
        </p>
        <Link className={styles.dashboardLink} to={routePaths.dashboard}>
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
