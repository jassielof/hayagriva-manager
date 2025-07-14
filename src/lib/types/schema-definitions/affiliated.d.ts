import type { AffiliatedRole } from './affiliated-role';
import type { PersonOrPeople } from './person-or-people';

export type Affiliated = {
  role: AffiliatedRole;
  /** People involved */
  names: PersonOrPeople;
};
