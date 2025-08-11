import { getHayagrivaSchema } from '$lib/hayagriva';

export const AFFILIATED_ROLES: string[] = await getHayagrivaSchema().then(
  (schema) => schema.definitions.roleType.enum
);
