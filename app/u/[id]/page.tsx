"use client";

import PersonViewPage from "@/modules/persona/view/pages/PersonViewPage";
import { use } from "react";

type ParamsT = {
  id: string;
};

export default function Page({ params }: { params: Promise<ParamsT> }) {
  const { id } = use(params);
  return <PersonViewPage id={id}/>;
}
