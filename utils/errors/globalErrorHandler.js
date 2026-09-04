import { AppError } from "./error";
export default function handleError(err, res) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,

        details: err.details ?? undefined,
      },
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Erro interno do servidor" },
  });
}
