import { apiClient } from "../core";
import { TPet } from "./types";

export const readPet = async (pet_id: string) =>
  await apiClient.get<TPet>("/pets");
