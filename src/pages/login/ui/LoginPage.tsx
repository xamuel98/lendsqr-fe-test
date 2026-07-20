import { Link, useNavigate } from "react-router-dom";

import { routePaths } from "@app/router";
import logo from "@shared/assets/images/lendsqr-logo.svg";
import signInIllustration from "@shared/assets/images/lendsqr-sign-in-illustration.svg";
import { createDemoAuthSession, demoAccountEmail } from "@shared/storage";
import { DynamicForm } from "@shared/ui/dynamic-form";
import { useToast } from "@shared/ui/toast";

import { loginDefaultValues, loginFields } from "../model/loginFields";
import { loginSchema } from "../model/loginSchema";
import type { LoginFormValues } from "../model/loginTypes";
import { demoLoginUser } from "../model/loginUser";

import styles from "./LoginPage.module.scss";

export function LoginPage() {
  const navigate = useNavigate();
  const { clearToasts, showToast } = useToast();

  async function handleLogin(values: LoginFormValues) {
    clearToasts();

    await new Promise((resolve) => {
      window.setTimeout(resolve, 450);
    });

    if (values.email.toLowerCase() === "server@lendsqr.com") {
      showToast({
        message: "We couldn't reach the server. Please try again.",
        tone: "error"
      });

      return;
    }

    if (
      values.email.toLowerCase() !== demoAccountEmail ||
      values.password !== "password123"
    ) {
      showToast({
        message: "Invalid email or password.",
        tone: "error"
      });

      return;
    }

    createDemoAuthSession({ organization: demoLoginUser.organization });
    showToast({
      message: "Login successful!",
      tone: "success"
    });
    void navigate(routePaths.users);
  }

  return (
    <main className={styles.page} id="main-content">
      <section className={styles.brandingPane}>
        <Link aria-label="Lendsqr home" className={styles.brand} to="/login">
          <img
            alt="Lendsqr"
            className={styles.brandLogo}
            height="30"
            src={logo}
          />
        </Link>
        <div className={styles.illustrationWrap}>
          <img
            alt="Lendsqr Illustration"
            className={styles.illustration}
            src={signInIllustration}
          />
        </div>
      </section>
      <section className={styles.formPane}>
        <div className={styles.formShell}>
          <div className={styles.headingGroup}>
            <h1 className={styles.title}>Welcome!</h1>
            <p className={styles.subtitle}>Enter details to login.</p>
          </div>

          <DynamicForm
            beforeSubmit={
              <Link className={styles.forgotPasswordLink} to="/forgot-password">
                Forgot Password?
              </Link>
            }
            beforeSubmitClassName={styles.forgotPasswordSlot}
            defaultValues={loginDefaultValues}
            fields={loginFields}
            onSubmit={handleLogin}
            submitButton={{
              label: "LOG IN",
              loadingLabel: "LOGGING IN",
              fullWidth: true,
              size: "login"
            }}
            validationSchema={loginSchema}
          />
        </div>
      </section>
    </main>
  );
}
