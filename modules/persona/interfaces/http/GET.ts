import { ResponseHandler } from "@/src/utils/ApiResponseHandler";
import { NextRequest } from "next/server";
import { buildPersonController } from "../PersonModule";

export async function GET(req: NextRequest) {
  try {
    const controller = buildPersonController();

    const res = await controller.list();
    return ResponseHandler.success("Correcto", res);
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
export async function inyectarDatos(req: NextRequest) {
  try {
    const controller = buildPersonController();

    await controller.inyectData();
    return ResponseHandler.success("Correcto", {});
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
export async function GET_ID(id: string) {
  try {
    const controller = buildPersonController();
    const res = await controller.search({ personId: id });
    return ResponseHandler.success("Correcto", res);
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
export async function MOST_RELATION() {
  try {
    const controller = buildPersonController();
    const res = await controller.mostRelationalPerson();
    return ResponseHandler.success("Correcto", res);
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
export async function COMMOND_FRIEND(req: NextRequest) {
  try {
    const controller = buildPersonController();
    const res = await controller.commonFriends({
      id1: req.nextUrl.searchParams.get("id1") || "1",
      id2: req.nextUrl.searchParams.get("id2") || "2",
    });
    return ResponseHandler.success("Correcto", res);
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
