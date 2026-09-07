import { z } from 'zod';

/**
 * Esquema de validación en tiempo de ejecución (Runtime Schema)
 * Blindaje contra inyecciones de valores negativos, cero, tipos alterados y strings vacíos.
 */
export const CartUpdateSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, 'El productId no puede estar vacío.')
    .regex(/^[a-zA-Z0-9-_]+$/, 'El productId debe ser alfanumérico válido.'),

  quantity: z
    .number()
    .int('La cantidad debe ser un número entero (sin decimales).')
    .min(1, 'La cantidad mínima por producto debe ser al menos 1.'),

  price: z
    .number()
    .positive('El precio debe ser un valor estrictamente mayor a 0.')
    .finite('El precio debe ser un número finito válido.'),
});

export type CartUpdateInput = z.infer<typeof CartUpdateSchema>;

// Mock de la base de datos para la demostración
const mockDb = {
  cart: {
    update: async ({ where, data }: { where: { productId: string }; data: { quantity: number; totalCost: number } }) => {
      return {
        id: 'cart-item-1',
        productId: where.productId,
        quantity: data.quantity,
        totalCost: data.totalCost,
        updatedAt: new Date().toISOString(),
      };
    },
  },
};

/**
 * Endpoint Blindado de Actualización de Carrito
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // 1. Validación estricta en tiempo de ejecución con Zod
    const validationResult = CartUpdateSchema.safeParse(rawBody);

    if (!validationResult.success) {
      // Formatear los errores de validación de forma legible
      const formattedErrors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));

      return Response.json(
        {
          success: false,
          error: 'Error de validación en los datos enviados (Bad Request).',
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    // 2. Datos tipados y 100% saneados tras superar la validación
    const { productId, quantity, price } = validationResult.data;

    // 3. Cálculo seguro del costo total
    const totalCost = Number((quantity * price).toFixed(2));

    const updatedRecord = await mockDb.cart.update({
      where: { productId },
      data: { quantity, totalCost },
    });

    return Response.json(
      {
        success: true,
        message: 'Carrito actualizado exitosamente.',
        data: updatedRecord,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: 'El cuerpo de la solicitud no es un JSON válido o ocurrió un error interno.',
      },
      { status: 400 }
    );
  }
}
