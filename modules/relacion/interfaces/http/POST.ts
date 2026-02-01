import { ResponseHandler } from "@/src/utils/ApiResponseHandler";
import { NextRequest } from "next/server";
import { buildRelationController } from "../RelationModule";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const controller = buildRelationController();
    const id = await controller.create({ body: raw });
    return ResponseHandler.success("Relacion creada correctamente", id);
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
