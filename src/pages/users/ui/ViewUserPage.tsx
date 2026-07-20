import { useId } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { routePaths } from "@app/router";
import { type UserDetailField, type UserDetailTab } from "@entities/user";
import {
  getUserStatusAction,
  useFetchUserDetails,
  useUserAccountStatus,
  useUserStatusAction
} from "@features/user";
import { Button } from "@shared/ui/button";
import { EmptyState } from "@shared/ui/empty-state";

import styles from "./ViewUserPage.module.scss";
import { ViewUserPageSkeleton } from "./ViewUserPageSkeleton";
import { IBack, IUserAvatar } from "@shared/assets/icons";

const tabs = [
  { id: "general", label: "General Details" },
  { id: "documents", label: "Documents" },
  { id: "bank", label: "Bank Details" },
  { id: "loans", label: "Loans" },
  { id: "savings", label: "Savings" },
  { id: "system", label: "App and System" }
] as const satisfies readonly UserDetailTab[];

type UserDetailTabId = (typeof tabs)[number]["id"];
function isUserDetailTabId(value: string | null): value is UserDetailTabId {
  return tabs.some((tab) => tab.id === value);
}

function getUsersListSearch(searchParams: URLSearchParams) {
  const usersSearchParams = new URLSearchParams(searchParams);
  usersSearchParams.delete("tab");

  return usersSearchParams.toString();
}

function TierStars({ tier }: { tier: 1 | 2 | 3 }) {
  return (
    <span aria-label={`User tier ${tier} of 3`} className={styles.tierStars}>
      {[1, 2, 3].map((star) => (
        <span aria-hidden="true" key={star}>
          {star <= tier ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

function DetailFields({
  fields
}: {
  fields: UserDetailField[];
}) {
  return (
    <dl className={styles.fieldGrid}>
      {fields.map((field) => (
        <div className={styles.field} key={field.id}>
          <dt>{field.label}</dt>
          <dd>
            {field.href ? (
              <a
                aria-label={`${field.label}: ${field.value}`}
                className={styles.fieldLink}
                href={field.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {field.value}
              </a>
            ) : (
              field.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ViewUserPage() {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requestUserStatusAction } = useUserStatusAction();
  const tabId = useId();
  const activeTab = isUserDetailTabId(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "general";
  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label ?? "Selected category";
  const usersListSearch = getUsersListSearch(searchParams);
  const usersListPath = usersListSearch
    ? `${routePaths.users}?${usersListSearch}`
    : routePaths.users;
  const {
    data: user,
    error,
    isError,
    isLoading,
    isRefetching,
    refetch
  } = useFetchUserDetails(userId);
  const { status: userStatus } = useUserAccountStatus(user);
  const availableAction = userStatus ? getUserStatusAction(userStatus) : null;

  function setActiveTab(tab: UserDetailTabId) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("tab", tab);
    setSearchParams(nextSearchParams);
  }

  if (isLoading) {
    return <ViewUserPageSkeleton usersListPath={usersListPath} />;
  }

  if (isError || !user) {
    const message =
      error?.kind === "not-found"
        ? "The requested user could not be found."
        : (error?.message ?? "Unable to load this user's details right now.");

    return (
      <section aria-labelledby="user-details-title" className={styles.page}>
        <Link className={styles.backLink} to={usersListPath}>
          <IBack />
          Back to Users
        </Link>
        <h1 className={styles.pageTitle} id="user-details-title">
          User Details
        </h1>
        <EmptyState
          className={styles.tabEmptyState}
          isRetrying={isRefetching}
          message={message}
          variant="error"
          onRetry={() => {
            void refetch();
          }}
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="user-details-title" className={styles.page}>
      <div className={styles.headingArea}>
        <div className={styles.headingCopy}>
          <Link
            className={styles.backLink}
            to={usersListPath}
          >
            <IBack />
            Back to Users
          </Link>
          <h1 className={styles.pageTitle} id="user-details-title">
            User Details
          </h1>
        </div>

        {availableAction ? (
          <div className={styles.actions}>
            <Button
              color={availableAction === "blacklist" ? "danger" : "primary"}
              variant="outline"
              onClick={() => {
                requestUserStatusAction({
                  id: user.id,
                  name: user.fullName,
                  status: userStatus ?? user.status
                });
              }}
            >
              {availableAction === "blacklist" ? "Blacklist User" : "Activate User"}
            </Button>
          </div>
        ) : null}
      </div>

      <section
        aria-label={`${user.fullName} account summary`}
        className={styles.summaryCard}
      >
        <div className={styles.summaryContent}>
          <div className={styles.identity}>
            <span aria-hidden="true" className={styles.avatar}>
              <IUserAvatar />
            </span>
            <div>
              <h2>{user.fullName}</h2>
              <p>{user.userCode}</p>
            </div>
          </div>

          <div className={`${styles.summaryMetric} ${styles.userTier}`}>
            <p>User's Tier</p>
            <TierStars tier={user.tier} />
          </div>

          <div className={styles.summaryMetric}>
            <strong>N200,000.00</strong>
            <p>
              {user.accountNumber}/{user.bankName}
            </p>
          </div>
        </div>

        <div aria-label="User detail categories" className={styles.tabScroller}>
          <div className={styles.tabs} role="tablist">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.id;

              return (
                <button
                  aria-controls={`${tabId}-${tab.id}`}
                  aria-selected={isSelected}
                  className={styles.tab}
                  id={`${tabId}-${tab.id}-tab`}
                  key={tab.id}
                  role="tab"
                  tabIndex={isSelected ? 0 : -1}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div
        aria-labelledby={`${tabId}-${activeTab}-tab`}
        className={styles.tabPanel}
        id={`${tabId}-${activeTab}`}
        role="tabpanel"
      >
        {activeTab === "general" ? (
          <section
            aria-label="General user details"
            className={styles.detailsCard}
          >
            {user.generalDetails.map((section) => (
              <section className={styles.detailSection} key={section.id}>
                <h2>{section.title}</h2>
                <DetailFields fields={section.fields} />
              </section>
            ))}

            <section className={styles.detailSection}>
              <h2>Guarantor</h2>
              <div className={styles.guarantorList}>
                {user.guarantors.map((guarantor) => (
                  <article className={styles.guarantor} key={guarantor.id}>
                    <dl className={styles.fieldGrid}>
                      <div className={styles.field}>
                        <dt>Full name</dt>
                        <dd>{guarantor.fullName}</dd>
                      </div>
                      <div className={styles.field}>
                        <dt>Phone number</dt>
                        <dd>{guarantor.phoneNumber}</dd>
                      </div>
                      <div className={styles.field}>
                        <dt>Email address</dt>
                        <dd>{guarantor.email}</dd>
                      </div>
                      <div className={styles.field}>
                        <dt>Relationship</dt>
                        <dd>{guarantor.relationship}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </section>
          </section>
        ) : (
          <section className={styles.detailsCard}>
            <EmptyState
              className={styles.tabEmptyState}
              message={`No information is available for ${activeTabLabel}.`}
            />
          </section>
        )}
      </div>
    </section>
  );
}
