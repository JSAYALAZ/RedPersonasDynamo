import { NextResponse } from "next/server";
import { AppError } from "./ApiErrorHandler";
import { isAxiosApiError } from "../types/api.types";

/** Envoltorio JSON estándar para respuestas exitosas. */
export type ApiSuccess<T = unknown> = {
  success: true;
  message: string;
  data: T;
};

/** Tipos binarios aceptados para descargas/exports. */
export type BinaryFileInput = Blob | ArrayBuffer | Uint8Array;


export class ResponseHandler {

  static success<T = unknown>(
    message: string,
    data: T | null = null,
    status: number = 200
  ): NextResponse<ApiSuccess> {
    return NextResponse.json<ApiSuccess<T | null>>(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static async successExcel(
    message: string,
    file: BinaryFileInput,
    filename = "export.xlsx",
    mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    status = 200
  ): Promise<NextResponse> {
    // Normaliza a Buffer
    const buf =
      file instanceof Blob
        ? Buffer.from(await file.arrayBuffer())
        : file instanceof ArrayBuffer
        ? Buffer.from(new Uint8Array(file))
        : Buffer.from(file as Uint8Array);

    return new NextResponse(buf, {
      status,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Success": "true", // ← success
        "X-Message": encodeURIComponent(message), // ← message
      },
    });
  }

  static successImage(data: Buffer, status: number = 200): NextResponse<ApiSuccess> {
    return NextResponse.json<ApiSuccess<Buffer>>(
      {
        success: true,
        message: "Correcto",
        data,
      },
      {
        status,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": data.length.toString(),
        },
      }
    );
  }

  static error(error: unknown, fallbackMsg?: string): NextResponse {
    if(isAxiosApiError(error)){
      return  AppError.internal(error.response?.data.message).toResponse()
    }
    if (error instanceof AppError) {
      return error.toResponse();
    }
  
    return AppError.internal(
      fallbackMsg ?? "Error interno en el servidor"
    ).toResponse();
  }
}
