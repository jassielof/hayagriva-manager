import { hayagrivaService } from '$lib/services/hayagriva.service';

type AffiliatedRoleSchema = {
  definitions: {
    roleType: {
      enum: string[];
    };
  };
};

const schema = (await hayagrivaService.getSchema()) as AffiliatedRoleSchema;

export const AFFILIATED_ROLES: string[] = schema.definitions.roleType.enum;
