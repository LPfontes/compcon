import { SaveController } from './SaveController';

interface ISaveable {
  SaveController: SaveController;

  Name: string;
  ID: string;
  ItemType: string;
  StorageType: string;

  Clone(): ISaveable;
  Serialize(): object;
}

export type { ISaveable };
