// app/lib/AppError.ts
import { NextResponse } from "next/server";

type AppErrorOpts = {
  status?: number;
  code?: string; // tu código interno: "VALIDATION_ERROR", "NOT_FOUND", etc.
  details?: unknown; // zod issues, campos inválidos, etc.
  cause?: unknown; // preserve original error
};


export class AppError extends Error {
  readonly status: number;

  readonly code: string;

  readonly details?: unknown;


  constructor(message: string, opts: AppErrorOpts = {}) {
    super(message, { cause: opts.cause });
    this.status = opts.status ?? 500;
    this.code = opts.code ?? "INTERNAL_ERROR";
    this.details = opts.details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static validation(message = "Datos inválidos", details?: unknown) {
    return new AppError(message, {
      status: 400,
      code: "VALIDATION_ERROR",
      details,
    });
  }
  static unauthorized(message = "No autorizado") {
    return new AppError(message, { status: 401, code: "UNAUTHORIZED" });
  }

  static forbidden(message = "Prohibido") {
    return new AppError(message, { status: 403, code: "FORBIDDEN" });
  }


  static notFound(message = "No encontrado") {
    return new AppError(message, { status: 404, code: "NOT_FOUND" });
  }

  static hasDependencies(
    message = "No se puede eliminar: tiene registros asociados"
  ) {
    return new AppError(message, { status: 409, code: "HAS_DEPENDENCIES" });
  }

  static conflict(message = "Conflicto") {
    return new AppError(message, { status: 409, code: "CONFLICT" });
  }

  static createFailed(
    message = "No se pudo crear el registro",
    details?: unknown
  ) {
    return new AppError(message, {
      status: 422,
      code: "CREATE_FAILED",
      details,
    });
  }

  static dependencyInvalid(message = "Relación inválida o inexistente") {
    return new AppError(message, { status: 422, code: "DEPENDENCY_INVALID" });
  }

  static internal(message = "Error interno en el servidor") {
    return new AppError(message, { status: 500, code: "INTERNAL_ERROR" });
  }


  toResponse() {
    return NextResponse.json(
      {
        success: false,
        message: this.message,
        code: this.code,
        errors: this.details ?? undefined,
      },
      { status: this.status }
    );
  }
}
