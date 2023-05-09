import server from "./server.services";

export function getUndefinedConfigs(configsFields) {
  //todo : get from server
  const undefinedFields = [
    "domain",
    "database",
    "jwtPrivateKey",
    "host",
    "port",
    "username",
    "password",
    "from",
  ];

  Object.keys(configsFields).forEach((f) => {
    if (!undefinedFields.includes(f)) delete configsFields[f];
  });

  return configsFields;
}

export async function saveConfigs(data) {
  // console.log(data);
  try {
    await server.put("configs", data);
    return true;
  } catch (err) {
    // console.log(err);
  }
}

export async function saveSettings(data) {
  await server.put("settings", data);
  return true;
}

export async function saveCreds(data) {
  await server.put("users", data);
  return true;
}
