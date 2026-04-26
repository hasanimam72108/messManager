const STORAGE_KEYS = {
  USERS: "mm_users",
  REQUESTS: "mm_mess_requests",
  MESSES: "mm_messes",
  MEMBERS: "mm_members",
  USER_MEALS: "mm_user_meals",
  USER_TRANSACTIONS: "mm_user_transactions",
};

const DEFAULT_SUPER_ADMIN_EMAIL =
  import.meta.env.VITE_SUPER_ADMIN_EMAIL || "superadmin@mess.com";
const DEFAULT_SUPER_ADMIN_PASSWORD =
  import.meta.env.VITE_SUPER_ADMIN_PASSWORD || "admin123";
const DEFAULT_MANAGER_EMAIL = "manager@mess.com";
const DEFAULT_MANAGER_PASSWORD = "manager123";
const DEFAULT_USER_EMAIL = "user@mess.com";
const DEFAULT_USER_PASSWORD = "user123";

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const uid = (prefix) =>
  `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const round2 = (value) => Math.round(value * 100) / 100;

const getDefaultMeals = () => [
  { id: uid("meal"), date: "2026-02-24", mealType: "Dinner", quantity: 1 },
  { id: uid("meal"), date: "2026-02-24", mealType: "Lunch", quantity: 1 },
  { id: uid("meal"), date: "2026-02-23", mealType: "Dinner", quantity: 1 },
  { id: uid("meal"), date: "2026-02-23", mealType: "Lunch", quantity: 1 },
];

const getDefaultTransactions = () => [
  {
    id: uid("txn"),
    date: "2026-02-01",
    type: "Deposit",
    amount: 2000,
    balance: 2000,
  },
  {
    id: uid("txn"),
    date: "2026-02-15",
    type: "Expense",
    amount: -250,
    balance: 1750,
  },
];

const readUserScopedMap = (key) => {
  const value = read(key);
  if (value && !Array.isArray(value) && typeof value === "object") {
    return value;
  }
  return {};
};

const writeUserScopedMap = (key, value) => {
  write(key, value);
};

const roleHomeMap = {
  superAdmin: "/super-admin/dashboard",
  manager: "/manager/dashboard",
  user: "/user/dashboard",
};

export const getRoleHomePath = (role) => roleHomeMap[role] || "/login";

export const initializeMockData = () => {
  const users = read(STORAGE_KEYS.USERS);
  const messes = read(STORAGE_KEYS.MESSES);
  const members = read(STORAGE_KEYS.MEMBERS);

  if (!users.some((item) => item.role === "superAdmin")) {
    users.push({
      id: uid("user"),
      name: "Super Admin",
      email: DEFAULT_SUPER_ADMIN_EMAIL,
      password: DEFAULT_SUPER_ADMIN_PASSWORD,
      role: "superAdmin",
      messId: null,
      mustChangePassword: false,
    });
  }

  let managerUser = users.find((item) => item.role === "manager");
  if (!managerUser) {
    const messId = uid("mess");
    managerUser = {
      id: uid("user"),
      name: "Demo Manager",
      email: DEFAULT_MANAGER_EMAIL,
      password: DEFAULT_MANAGER_PASSWORD,
      role: "manager",
      messId,
      mustChangePassword: false,
    };
    users.push(managerUser);
    messes.push({
      id: messId,
      name: "Demo Mess",
      managerUserId: managerUser.id,
      createdAt: new Date().toISOString(),
    });
  }

  let demoUser = users.find((item) => item.role === "user");
  if (!demoUser) {
    demoUser = {
      id: uid("user"),
      name: "Demo User",
      email: DEFAULT_USER_EMAIL,
      password: DEFAULT_USER_PASSWORD,
      role: "user",
      messId: managerUser.messId,
      mustChangePassword: false,
    };
    users.push(demoUser);

    members.push({
      id: uid("member"),
      userId: demoUser.id,
      messId: managerUser.messId,
      name: demoUser.name,
      email: demoUser.email,
    });
  }

  write(STORAGE_KEYS.USERS, users);
  write(STORAGE_KEYS.MESSES, messes);
  write(STORAGE_KEYS.MEMBERS, members);

  const mealsMap = readUserScopedMap(STORAGE_KEYS.USER_MEALS);
  const transactionsMap = readUserScopedMap(STORAGE_KEYS.USER_TRANSACTIONS);

  users
    .filter((item) => item.role === "user")
    .forEach((item) => {
      if (!Array.isArray(mealsMap[item.id])) {
        mealsMap[item.id] = getDefaultMeals();
      }
      if (!Array.isArray(transactionsMap[item.id])) {
        transactionsMap[item.id] = getDefaultTransactions();
      }
    });

  writeUserScopedMap(STORAGE_KEYS.USER_MEALS, mealsMap);
  writeUserScopedMap(STORAGE_KEYS.USER_TRANSACTIONS, transactionsMap);

  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    write(STORAGE_KEYS.REQUESTS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSES)) {
    write(STORAGE_KEYS.MESSES, messes);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    write(STORAGE_KEYS.MEMBERS, members);
  }
};

export const requestMess = ({ messName, managerName, managerEmail }) => {
  const requests = read(STORAGE_KEYS.REQUESTS);
  const normalizedEmail = managerEmail.trim().toLowerCase();

  const alreadyPending = requests.some(
    (item) =>
      item.managerEmail === normalizedEmail && item.status === "pending",
  );
  if (alreadyPending) {
    throw new Error("A pending request already exists for this email.");
  }

  const newRequest = {
    id: uid("req"),
    messName: messName.trim(),
    managerName: managerName.trim(),
    managerEmail: normalizedEmail,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  requests.unshift(newRequest);
  write(STORAGE_KEYS.REQUESTS, requests);
  return newRequest;
};

export const listMessRequests = (status) => {
  const requests = read(STORAGE_KEYS.REQUESTS);
  if (!status) return requests;
  return requests.filter((item) => item.status === status);
};

export const rejectMessRequest = (requestId) => {
  const requests = read(STORAGE_KEYS.REQUESTS);
  const updated = requests.map((item) =>
    item.id === requestId ? { ...item, status: "rejected" } : item,
  );
  write(STORAGE_KEYS.REQUESTS, updated);
};

export const approveMessRequest = (requestId) => {
  const requests = read(STORAGE_KEYS.REQUESTS);
  const request = requests.find((item) => item.id === requestId);

  if (!request || request.status !== "pending") {
    throw new Error("Invalid request.");
  }

  const users = read(STORAGE_KEYS.USERS);
  if (users.some((item) => item.email === request.managerEmail)) {
    throw new Error("A user with this manager email already exists.");
  }

  const tempPassword = `Manager${Math.floor(1000 + Math.random() * 9000)}`;
  const messId = uid("mess");

  const managerUser = {
    id: uid("user"),
    name: request.managerName || "Manager",
    email: request.managerEmail,
    password: tempPassword,
    role: "manager",
    messId,
    mustChangePassword: true,
  };

  const messes = read(STORAGE_KEYS.MESSES);
  messes.push({
    id: messId,
    name: request.messName,
    managerUserId: managerUser.id,
    createdAt: new Date().toISOString(),
  });

  users.push(managerUser);
  write(STORAGE_KEYS.USERS, users);
  write(STORAGE_KEYS.MESSES, messes);

  const updatedRequests = requests.map((item) =>
    item.id === requestId ? { ...item, status: "approved" } : item,
  );
  write(STORAGE_KEYS.REQUESTS, updatedRequests);

  return { tempPassword, managerUser };
};

export const loginMock = ({ email, password }) => {
  const users = read(STORAGE_KEYS.USERS);
  const user = users.find(
    (item) =>
      item.email === email.trim().toLowerCase() && item.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      messId: user.messId,
      mustChangePassword: user.mustChangePassword,
    },
    token: `mock_${user.id}`,
  };
};

export const listManagers = () => {
  const users = read(STORAGE_KEYS.USERS).filter(
    (item) => item.role === "manager",
  );
  const messes = read(STORAGE_KEYS.MESSES);

  return users.map((manager) => {
    const mess = messes.find((item) => item.id === manager.messId);
    return {
      id: manager.id,
      name: manager.name,
      email: manager.email,
      messName: mess?.name || "N/A",
    };
  });
};

export const listMessesWithDetails = () => {
  const users = read(STORAGE_KEYS.USERS);
  const messes = read(STORAGE_KEYS.MESSES);
  const members = read(STORAGE_KEYS.MEMBERS);

  return messes.map((mess) => {
    const manager = users.find((item) => item.id === mess.managerUserId);
    const memberCount = members.filter(
      (item) => item.messId === mess.id,
    ).length;

    return {
      id: mess.id,
      name: mess.name,
      managerName: manager?.name || "N/A",
      managerEmail: manager?.email || "N/A",
      memberCount,
      createdAt: mess.createdAt,
    };
  });
};

export const getSystemReport = () => {
  const users = read(STORAGE_KEYS.USERS);
  const messes = read(STORAGE_KEYS.MESSES);
  const requests = read(STORAGE_KEYS.REQUESTS);

  return {
    totalMesses: messes.length,
    totalManagers: users.filter((item) => item.role === "manager").length,
    totalUsers: users.filter((item) => item.role === "user").length,
    pendingRequests: requests.filter((item) => item.status === "pending")
      .length,
  };
};

export const getMessNameById = (messId) => {
  if (!messId) return "N/A";
  const mess = read(STORAGE_KEYS.MESSES).find((item) => item.id === messId);
  return mess?.name || "N/A";
};

export const listMembersByManager = (managerUserId) => {
  const users = read(STORAGE_KEYS.USERS);
  const manager = users.find((item) => item.id === managerUserId);
  if (!manager?.messId) return [];

  return read(STORAGE_KEYS.MEMBERS).filter(
    (item) => item.messId === manager.messId,
  );
};

export const addMemberByManager = ({ managerUserId, name, email }) => {
  const users = read(STORAGE_KEYS.USERS);
  const manager = users.find((item) => item.id === managerUserId);

  if (!manager?.messId) {
    throw new Error("Manager mess not found.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((item) => item.email === normalizedEmail)) {
    throw new Error("A user with this email already exists.");
  }

  const tempPassword = `User${Math.floor(1000 + Math.random() * 9000)}`;
  const memberUserId = uid("user");

  users.push({
    id: memberUserId,
    name: name.trim(),
    email: normalizedEmail,
    password: tempPassword,
    role: "user",
    messId: manager.messId,
    mustChangePassword: true,
  });
  write(STORAGE_KEYS.USERS, users);

  const members = read(STORAGE_KEYS.MEMBERS);
  const member = {
    id: uid("member"),
    userId: memberUserId,
    messId: manager.messId,
    name: name.trim(),
    email: normalizedEmail,
  };
  members.unshift(member);
  write(STORAGE_KEYS.MEMBERS, members);

  return { member, tempPassword };
};

export const completeFirstLoginPasswordSetup = ({ userId, newPassword }) => {
  const users = read(STORAGE_KEYS.USERS);
  const normalizedPassword = newPassword?.trim();

  if (!normalizedPassword || normalizedPassword.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const targetUser = users.find((item) => item.id === userId);
  if (!targetUser) {
    throw new Error("User not found.");
  }

  targetUser.password = normalizedPassword;
  targetUser.mustChangePassword = false;
  write(STORAGE_KEYS.USERS, users);

  return {
    id: targetUser.id,
    name: targetUser.name,
    email: targetUser.email,
    role: targetUser.role,
    messId: targetUser.messId,
    mustChangePassword: targetUser.mustChangePassword,
  };
};

export const listMealsByUser = (userId) => {
  if (!userId) return [];
  const mealsMap = readUserScopedMap(STORAGE_KEYS.USER_MEALS);
  const meals = mealsMap[userId];

  if (!Array.isArray(meals)) {
    mealsMap[userId] = getDefaultMeals();
    writeUserScopedMap(STORAGE_KEYS.USER_MEALS, mealsMap);
    return mealsMap[userId];
  }

  return meals;
};

export const addMealByUser = ({ userId, date, mealType, quantity }) => {
  if (!userId) {
    throw new Error("User not found.");
  }

  const mealsMap = readUserScopedMap(STORAGE_KEYS.USER_MEALS);
  const existing = Array.isArray(mealsMap[userId]) ? mealsMap[userId] : [];
  const entry = {
    id: uid("meal"),
    date,
    mealType,
    quantity: mealType === "Off" ? 0 : Number(quantity),
  };

  mealsMap[userId] = [entry, ...existing];
  writeUserScopedMap(STORAGE_KEYS.USER_MEALS, mealsMap);
  return mealsMap[userId];
};

export const listTransactionsByUser = (userId) => {
  if (!userId) return [];
  const transactionsMap = readUserScopedMap(STORAGE_KEYS.USER_TRANSACTIONS);
  const transactions = transactionsMap[userId];

  if (!Array.isArray(transactions)) {
    transactionsMap[userId] = getDefaultTransactions();
    writeUserScopedMap(STORAGE_KEYS.USER_TRANSACTIONS, transactionsMap);
    return transactionsMap[userId];
  }

  return transactions;
};

export const addDepositByUser = ({ userId, amount }) => {
  if (!userId) {
    throw new Error("User not found.");
  }

  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const transactionsMap = readUserScopedMap(STORAGE_KEYS.USER_TRANSACTIONS);
  const existing = Array.isArray(transactionsMap[userId])
    ? transactionsMap[userId]
    : getDefaultTransactions();

  const currentBalance = existing.length > 0 ? Number(existing[0].balance) : 0;
  const nextBalance = round2(currentBalance + parsedAmount);

  const entry = {
    id: uid("txn"),
    date: new Date().toISOString().split("T")[0],
    type: "Deposit",
    amount: parsedAmount,
    balance: nextBalance,
  };

  transactionsMap[userId] = [entry, ...existing];
  writeUserScopedMap(STORAGE_KEYS.USER_TRANSACTIONS, transactionsMap);
  return transactionsMap[userId];
};

export const getUserDashboardStats = (userId) => {
  const meals = listMealsByUser(userId);
  const transactions = listTransactionsByUser(userId);
  const costPerMeal = 72.22;

  const totalMeals = meals.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  const totalBill = round2(totalMeals * costPerMeal);
  const paidAmount = round2(
    transactions
      .filter((item) => Number(item.amount) > 0)
      .reduce((sum, item) => sum + Number(item.amount), 0),
  );
  const currentBalance = transactions.length
    ? Number(transactions[0].balance)
    : 0;
  const dueAmount = Math.max(round2(totalBill - paidAmount), 0);

  return {
    totalMeals,
    costPerMeal,
    totalBill,
    paidAmount,
    currentBalance,
    dueAmount,
  };
};

export const getMealBreakdownByUser = (userId) => {
  const meals = listMealsByUser(userId);
  const totals = meals.reduce(
    (acc, item) => {
      const qty = Number(item.quantity || 0);
      if (item.mealType === "Lunch") acc.lunch += qty;
      if (item.mealType === "Dinner") acc.dinner += qty;
      if (item.mealType === "Off") acc.off += 1;
      return acc;
    },
    { lunch: 0, dinner: 0, off: 0 },
  );

  return totals;
};
