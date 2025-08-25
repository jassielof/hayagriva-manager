import { hayagrivaService } from '$lib/services/hayagriva.service';

export const AFFILIATED_ROLES: string[] = await hayagrivaService
  .getSchema()
  .then((schema) => schema.definitions.roleType.enum);
