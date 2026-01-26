import { z } from 'zod';

type EnvResult<T extends z.ZodTypeAny> = z.infer<T>;
declare function loadEnv<T extends z.ZodTypeAny>(schema: T, opts?: {
    throwOnError?: boolean;
}): {
    ok: true;
    env: z.infer<T>;
} | {
    ok: false;
    error: z.ZodError;
};
declare function formatZodError(err: z.ZodError): string;

export { type EnvResult, formatZodError, loadEnv };
