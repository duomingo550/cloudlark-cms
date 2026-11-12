import * as migration_20261112_091644_initial from './20261112_091644_initial';
import * as migration_20261112_093546_add_leads_ip from './20261112_093546_add_leads_ip';

export const migrations = [
  {
    up: migration_20261112_091644_initial.up,
    down: migration_20261112_091644_initial.down,
    name: '20261112_091644_initial',
  },
  {
    up: migration_20261112_093546_add_leads_ip.up,
    down: migration_20261112_093546_add_leads_ip.down,
    name: '20261112_093546_add_leads_ip'
  },
];
