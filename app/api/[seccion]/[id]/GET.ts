import { AppError } from "@/src/utils/ApiErrorHandler";
import { NextRequest, NextResponse } from "next/server";

type Ctx = {
  params: Promise<{
    seccion: string;
    id: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: Ctx,
): Promise<NextResponse> {
  const { seccion, id } = await params;

  if (seccion in loader) {
    const load = loader[seccion as keyof typeof loader];
    return await load(req, id);
  }
  return AppError.notFound("Sección no soportada").toResponse();
}

const loader = {
  person: async (req: NextRequest, id: string) =>
    (await import("@/modules/persona/interfaces/http/GET")).GET_ID(id),
} as const;
