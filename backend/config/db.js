import { supabase } from "./supabase.js";
import { v4 as uuidv4 } from "uuid";

export { supabase };
export const generateId = () => uuidv4();
