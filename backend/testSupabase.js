import { supabase } from "./config/supabase.js";

const test = async () => {
  const { data, error } = await supabase.from("test").select("*");

  console.log(data, error);
};

test();