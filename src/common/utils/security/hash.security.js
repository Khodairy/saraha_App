import { hashSync, compareSync } from "bcrypt";
import { SULT_ROUND } from "../../../../config/config.service.js";

export const hash = ({ plainText, sult_round = SULT_ROUND } = {}) => {
  return hashSync(plainText, Number(sult_round));
};

export const compare = ({ plainText, cipherText } = {}) => {
  return compareSync(plainText, cipherText);
};
