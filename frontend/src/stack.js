import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables
  projectId: "dacdf29d-4fe3-49c4-8003-3592145f7d89",
  publishableClientKey: "pck_0v28f167m2x9ckbdz8yqf08b5f4v751z8y3711b3fpbsg",
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
  }
});
