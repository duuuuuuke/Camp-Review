import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
  return {
    message: "hello from login",
    test: "test",
    title: "Login",
    content: "haha",
  };
};
