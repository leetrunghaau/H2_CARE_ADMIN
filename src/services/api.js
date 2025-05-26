import instance from "../utils/axios-customize";
export const callLogin = (email, password) => {
  const URL_BACKEND = "/api/users/login-admin";
  const data = {
    email,
    password,
  };
  return instance.post(URL_BACKEND, data);
};

export const callLoginBenhNhan = (email, password) => {
  const URL_BACKEND = "/api/users/login-benh-nhan";
  const data = {
    email,
    password,
  };
  return instance.post(URL_BACKEND, data);
};

export const callRegister = (
  email,
  password,
  firstName,
  lastName,
  address,
  phone,
  gender
) => {
  const URL_BACKEND = "/api/users/register-admin";
  const data = {
    email,
    password,
    firstName,
    lastName,
    address,
    phone,
    gender,
  };
  return instance.post(URL_BACKEND, data);
};

export const callRegisterBenhNhan = (
  email,
  password,
  firstName,
  lastName,
  address,
  phone,
  gender
) => {
  const URL_BACKEND = "/api/users/register-benh-nhan";
  const data = {
    email,
    password,
    firstName,
    lastName,
    address,
    phone,
    gender,
  };
  return instance.post(URL_BACKEND, data);
};

export const callLogout = () => {
  const URL_BACKEND = "/api/users/logout-admin";
  return instance.post(URL_BACKEND);
};

export const callLogoutBenhNhan = () => {
  const URL_BACKEND = "/api/users/logout-benh-nhan";
  return instance.post(URL_BACKEND);
};

export const fetchOneAccKH = (id) => {
  const URL_BACKEND = `/api/users/get-one-kh?${id}`;
  return instance.get(URL_BACKEND);
};

export const doiThongTinKH = (
  _idAcc,
  lastName,
  firstName,
  email,
  phone,
  address,
  passwordMoi,
  image
) => {
  return instance.put("/api/users/doi-thong-tin", {
    _idAcc,
    lastName,
    firstName,
    email,
    phone,
    address,
    passwordMoi,
    image,
  });
};

export const fetchAllAccKH = (query) => {
  const URL_BACKEND = `/api/users/get-all-kh?${query}`;
  return instance.get(URL_BACKEND);
};

export const deleteAccKH = (id) => {
  const URL_BACKEND = `/api/users/delete-kh/${id}`;
  return instance.delete(URL_BACKEND);
};
