type ConfigType = {
  URL_FOR_IP: string;
  URL_FOR_NAME: string;
  URL_FOR_GENDER: string;
  PORT: number;
  FIELD: string;
  FIELD_VALUE: string;
};
let config: ConfigType = {
  URL_FOR_IP: "https://api.ipify.org/?format=json",
  URL_FOR_NAME: "https://random-data-api.com/api/name/random_name",
  URL_FOR_GENDER: "https://random-data-api.com/api/users/random_user",
  PORT: 3000,
  FIELD: "gender",
  FIELD_VALUE: "Female",
};

export default config;
