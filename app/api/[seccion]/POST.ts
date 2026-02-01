import { AppError } from "@/src/utils/ApiErrorHandler";
import { NextRequest } from "next/server";

type Ctx = {
  params: Promise<{
    seccion: string;
  }>;
};

export async function POST(req: NextRequest, { params }: Ctx) {
  const { seccion } = await params;
  if (seccion in loader) {
    const load = loader[seccion as keyof typeof loader];
    return await load(req);
  }
  return AppError.notFound("Sección no soportada").toResponse();
}
const loader = {
  person: async (req: NextRequest) =>
    (await import("@/modules/persona/interfaces/http/POST")).POST(req),
  relation: async (req: NextRequest) =>
    (await import("@/modules/relacion/interfaces/http/POST")).POST(req),
} as const;

// const POST_SOURCES: Record<
//   string,
//   (req: NextRequest) => Promise<NextResponse>
// > = {
//   client: createClient,
//   brand: createBrand,
//   product: createProduct,
//   supplier: createSupplier,
//   category: createCategory,
//   credit: createCredit,
//   // employee_rol: createEmployeesRol,
//   uber: createUber,
//   envio: createEnvio,
//   role: createRole,
//   payment: createPayment,
//   countableAccount: createCountableAccount,
//   line: createLinea,
//   // nomina: createNomina,
//   user: createUser,
//   sucursal: createSucursal,
//   bank: createBank,
//   sale: createSale,
//   charge_shipps: cobrarShipps,
//   sale_uber: createDeliveryInSale,
//   sale_asignation: createAsignationInSale,
//   module: createModule,
//   tenant: createTenant,
//   permiso: createPermission,
//   facturacion_data: createFacturationData,
//   downland: downlandExcel,
//   punto_emision: createPuntoEmition,
//   invoice_reception: receptIncoive,
//   invoice_autorization: getAutorization,
//   shop: createShop
// };
