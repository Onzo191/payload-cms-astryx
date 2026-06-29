import * as migration_20260629_072815_init_collections_and_globals from './20260629_072815_init_collections_and_globals';

export const migrations = [
  {
    up: migration_20260629_072815_init_collections_and_globals.up,
    down: migration_20260629_072815_init_collections_and_globals.down,
    name: '20260629_072815_init_collections_and_globals'
  },
];
