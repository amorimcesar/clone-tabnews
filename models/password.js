import bcryptjs from "bcryptjs";

const pepper = process.env.SECRET_PEPPER;

async function hash(password) {
  const rounds = getNumberOfRounds();
  const passwordWithPepper = password + pepper;
  return await bcryptjs.hash(passwordWithPepper, rounds);
}

async function compare(providedPassword, storedPassword) {
  const passwordWithPepper = providedPassword + pepper;
  return await bcryptjs.compare(passwordWithPepper, storedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

const password = {
  hash,
  compare,
};

export default password;
