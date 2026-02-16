import { hashSync, compareSync } from "bcrypt";

export const hash = ({ plainText, sult_round = 12 } = {}) => {
  return hashSync(plainText, sult_round);
};

export const compare = ({ plainText, cipherText } = {}) => {
  return compareSync(plainText, cipherText);
};
