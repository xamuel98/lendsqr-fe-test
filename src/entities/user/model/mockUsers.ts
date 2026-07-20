import type { User, UserStatus } from "./user.types";

const organizations = ["Lendsqr", "Irorun", "Lendstar", "Lendora"] as const;
const firstNames = [
  "Adedeji",
  "Debby",
  "Grace",
  "Tosin",
  "Chiamaka",
  "Emeka",
  "Aisha",
  "Tunde"
] as const;
const statuses: readonly UserStatus[] = [
  "inactive",
  "pending",
  "blacklisted",
  "active"
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function createUser(index: number): User {
  const firstName = firstNames[index % firstNames.length] ?? "User";
  const organization = organizations[index % organizations.length] ?? "Lendsqr";
  const joinedMonth = (index % 12) + 1;
  const joinedDay = (index % 27) + 1;
  const joinedYear = 2020 + (index % 5);
  const username = `${firstName.toLowerCase()}${String(index + 1).padStart(3, "0")}`;
  const domain = organization.toLowerCase().replace(/[^a-z]/g, "");

  return {
    id: `user-${String(index + 1).padStart(4, "0")}`,
    organization,
    username,
    email: `${username}@${domain}.com`,
    phoneNumber: `0${String(7000000000 + index).slice(-10)}`,
    dateJoined: `${joinedYear}-${pad(joinedMonth)}-${pad(joinedDay)}`,
    status: statuses[index % statuses.length] ?? "inactive"
  };
}

export const mockUsers: User[] = Array.from({ length: 500 }, (_, index) =>
  createUser(index)
);
