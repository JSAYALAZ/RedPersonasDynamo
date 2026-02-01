import { ResponseHandler } from "@/src/utils/ApiResponseHandler";
import { NextRequest } from "next/server";
import { buildPersonController } from "../PersonModule";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const controller = buildPersonController();
    const id = await controller.create({ body: raw });
    return ResponseHandler.success("Persona creada correctamente", id);
  } catch (error) {
    console.log(error);
    
    return ResponseHandler.error(error);
  }
}
