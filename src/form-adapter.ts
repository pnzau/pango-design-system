/**
 * TanStack Form and Zod are deliberately exported from the forms entry point,
 * not from core. Consumers who only render controls do not pay for validation.
 */
export { useForm } from "@tanstack/react-form";
export { z } from "zod";
