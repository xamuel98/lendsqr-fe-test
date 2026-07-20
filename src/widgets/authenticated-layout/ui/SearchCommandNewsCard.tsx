import styles from "./TopNavigation/TopNavigation.module.scss";

export function SearchCommandNewsCard() {
  return (
    <article className={styles.commandBanner}>
      <p className={styles.commandBannerEyebrow}>Product update</p>
      <h4 className={styles.commandBannerTitle}>New reporting shortcuts</h4>
      <p className={styles.commandBannerDescription}>
        Explore faster audit review flows and see the latest dashboard
        improvements in the docs.
      </p>
      <a
        className={styles.commandBannerLink}
        href="https://docs.lendsqr.com"
        rel="noreferrer"
        target="_blank"
      >
        Read update
      </a>
    </article>
  );
}
