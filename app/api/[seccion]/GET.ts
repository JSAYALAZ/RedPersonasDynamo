import { AppError } from "@/src/utils/ApiErrorHandler";
import { NextRequest } from "next/server";

type Ctx = {
  params: Promise<{
    seccion: string;
  }>;
};

export async function GET(req: NextRequest, { params }: Ctx) {
  const { seccion } = await params;
  if (seccion in loader) {
    const load = loader[seccion as keyof typeof loader];
    return await load(req);
  }
  return AppError.notFound("Sección no soportada").toResponse();
}

const loader = {
  person: async (req: NextRequest) =>
    (await import("@/modules/persona/interfaces/http/GET")).GET(req),
  most_relation: async (req: NextRequest) =>
    (await import("@/modules/persona/interfaces/http/GET")).MOST_RELATION(),
  common: async (req: NextRequest) =>
    (await import("@/modules/persona/interfaces/http/GET")).COMMOND_FRIEND(req),
} as const;
