// Auth helpers

export const addError = (params: AddErrorProps): void => {
  const { setValidationErrors, error } = params;
  setValidationErrors((currentErrors) => [...currentErrors, error]);
};

export const isEmail = (email: string) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
};

export const validateLogin = (email, password) => {
  let errors = [];

  if (!email) errors.push("Email field can't be empty");
  if (!password) errors.push("Password field can't be empty");
  if (email && !isEmail(email)) errors.push("Incorrect email format");

  return errors;
};

export const validateRegister = (name, email, password) => {
  let errors = [];

  if (!name) errors.push("Username field can't be empty");
  if (!email) errors.push("Email field can't be empty");
  if (!password) errors.push("Password field can't be empty");
  //   if (!/^[A-Za-z]\\w{4,14}$/.test(name)) errors.push("Invalid username");

  if (email && !isEmail(email)) errors.push("Incorrect email format");

  return errors;
};
