import { useEffect, useMemo } from "react";

import { userStatuses } from "@entities/user";
import { Button } from "@shared/ui/button";
import { DynamicForm } from "@shared/ui/dynamic-form";
import type { FormFieldSchema } from "@shared/ui/form-field";

import {
  userFilterSchema,
  type UserFilterField,
  type UserFilterValues
} from "../model";
import styles from "./UsersFilterForm.module.scss";

type UsersFilterFormProps = {
  initialFocusField?: UserFilterField;
  initialValues: UserFilterValues;
  organizations: string[];
  onApply: (values: UserFilterValues) => void;
  onReset: () => void;
};

export function UsersFilterForm({
  initialFocusField,
  initialValues,
  organizations,
  onApply,
  onReset
}: UsersFilterFormProps) {
  const fields = useMemo<FormFieldSchema<UserFilterValues>[]>(
    () => [
      {
        fieldType: "select",
        label: "Organization",
        labelWeight: "medium",
        name: "organization",
        options: organizations.map((organization) => ({
          label: organization,
          value: organization
        })),
        placeholder: "Select"
      },
      {
        fieldType: "input",
        inputType: "text",
        label: "Username",
        labelWeight: "medium",
        name: "username",
        placeholder: "User"
      },
      {
        fieldType: "input",
        inputType: "email",
        label: "Email",
        labelWeight: "medium",
        name: "email",
        placeholder: "Email"
      },
      {
        fieldType: "date",
        label: "Date",
        labelWeight: "medium",
        name: "dateJoined",
        placeholder: "Date"
      },
      {
        fieldType: "input",
        inputType: "tel",
        label: "Phone Number",
        labelWeight: "medium",
        name: "phoneNumber",
        placeholder: "Phone Number"
      },
      {
        fieldType: "select",
        label: "Status",
        labelWeight: "medium",
        name: "status",
        options: userStatuses.map((status) => ({
          label: `${status.slice(0, 1).toUpperCase()}${status.slice(1)}`,
          value: status
        })),
        placeholder: "Select"
      }
    ],
    [organizations]
  );

  useEffect(() => {
    if (initialFocusField) {
      document.getElementById(`field-${initialFocusField}`)?.focus();
    }
  }, [initialFocusField]);

  return (
    <DynamicForm<UserFilterValues>
      ariaLabel="Filter users"
      className={styles.form}
      defaultValues={initialValues}
      fields={fields}
      fieldsClassName={styles.fields}
      submitBlockClassName={styles.actions}
      validationSchema={userFilterSchema}
      beforeSubmit={
        <Button
          color="secondary"
          fullWidth
          type="button"
          variant="outline"
          onClick={() => {
            onReset();
          }}
        >
          Reset
        </Button>
      }
      onSubmit={onApply}
      submitButton={{
        fullWidth: true,
        label: "Filter"
      }}
    />
  );
}
