import { resourceToHex } from "@latticexyz/common";
import { DECIMALS } from "contracts/config/constants";
import { EObjectives, EUnit } from "contracts/config/enums";
import { parseEther } from "viem";

import { Entity } from "@primodiumxyz/reactive-tables";
import { toHex32 } from "@/utils/global/encode";

/** Minimum eth required to get drip */
export const minEth = parseEther("0.001");

/** Resource id of unlimited delegation system */
export const UNLIMITED_DELEGATION = resourceToHex({ type: "system", namespace: "", name: "unlimited" });

/** Speed scale of the world. Note: This is not the actual speed of the world. That is found in the P_GameConfig table. */
export const SPEED_SCALE = BigInt(100);

/** Precision of resource decimals */
export const RESOURCE_DECIMALS = DECIMALS;

/** Scale of resource decimals */
export const RESOURCE_SCALE = BigInt(10 ** DECIMALS);

/** Scale of multipliers. Used in multiplier tables. */
export const MULTIPLIER_SCALE = BigInt(100);

/** Scale of unit speed. */
export const UNIT_SPEED_SCALE = BigInt(100);

export const NUM_UNITS = Object.keys(EUnit).length / 2;
export const STORAGE_PREFIX = "primodiumSessionKey:";

/** Encoded keys. Used in prototype tables to prevent collisions */
export const Keys = {
  SELECTED: toHex32("selected") as Entity,
  ACTIVE: toHex32("active") as Entity,
  BATTLE: toHex32("battle") as Entity,
  ASTEROID: toHex32("asteroid.key") as Entity,
  FLEET_OWNED_BY: toHex32("fleet.key") as Entity,
  SECONDARY: toHex32("secondary") as Entity,

  EXPANSION: toHex32("Expansion"),
};

export const RockRelationship = {
  Ally: "Ally",
  Enemy: "Enemy",
  Neutral: "Neutral",
  Self: "Self",
} as const;

export const RockRelationshipColors = {
  [RockRelationship.Ally]: "success",
  [RockRelationship.Enemy]: "error",
  [RockRelationship.Neutral]: "",
  [RockRelationship.Self]: "accent",
};

export const Mode = {
  Asteroid: toHex32("mode:Building") as Entity,
  Starmap: toHex32("mode:Starmap") as Entity,
  CommandCenter: toHex32("mode:Manager") as Entity,
  Spectate: toHex32("mode:Spectate") as Entity,
};

/** Stores entity types. These entities are used in prototype tables. */
export const EntityType = {
  // Ores
  Iron: toHex32("Iron") as Entity,
  Copper: toHex32("Copper") as Entity,
  Lithium: toHex32("Lithium") as Entity,
  Titanium: toHex32("Titanium") as Entity,
  Iridium: toHex32("Iridium") as Entity,
  Kimberlite: toHex32("Kimberlite") as Entity,
  Platinum: toHex32("Platinum") as Entity,

  // Special Asteroid Types
  Common: toHex32("Common") as Entity,
  Wormhole: toHex32("Wormhole") as Entity,

  MainBase: toHex32("MainBase") as Entity,
  WormholeBase: toHex32("WormholeBase") as Entity,
  DroidBase: toHex32("DroidBase") as Entity,

  // Basic Buildings
  IronMine: toHex32("IronMine") as Entity,
  CopperMine: toHex32("CopperMine") as Entity,
  LithiumMine: toHex32("LithiumMine") as Entity,
  KimberliteMine: toHex32("KimberliteMine") as Entity,
  TitaniumMine: toHex32("TitaniumMine") as Entity,
  PlatinumMine: toHex32("PlatinumMine") as Entity,
  IridiumMine: toHex32("IridiumMine") as Entity,

  StorageUnit: toHex32("StorageUnit") as Entity,
  Garage: toHex32("Garage") as Entity,
  Workshop: toHex32("Workshop") as Entity,

  // Advanced Buildings
  IronPlateFactory: toHex32("IronPlateFactory") as Entity,
  PVCellFactory: toHex32("PVCellFactory") as Entity,
  AlloyFactory: toHex32("AlloyFactory") as Entity,
  SolarPanel: toHex32("SolarPanel") as Entity,
  Hangar: toHex32("Hangar") as Entity,
  DroneFactory: toHex32("DroneFactory") as Entity,
  StarmapperStation: toHex32("Starmapper") as Entity,
  SAMLauncher: toHex32("SAM") as Entity,
  ShieldGenerator: toHex32("ShieldGenerator") as Entity,
  Vault: toHex32("Vault") as Entity,
  Market: toHex32("Market") as Entity,
  Shipyard: toHex32("Shipyard") as Entity,

  Alloy: toHex32("Alloy") as Entity,
  PVCell: toHex32("PVCell") as Entity,

  Electricity: toHex32("U_Electricity") as Entity,
  Housing: toHex32("U_Housing") as Entity,
  FleetCount: toHex32("U_MaxFleets") as Entity,
  Unraidable: toHex32("U_Unraidable") as Entity,
  AdvancedUnraidable: toHex32("U_AdvancedUnraidable") as Entity,
  ColonyShipCapacity: toHex32("U_ColonyShip") as Entity,

  Defense: toHex32("U_Defense") as Entity,
  DefenseMultiplier: toHex32("M_DefenseMultiplier") as Entity,
  UnitProductionMultiplier: toHex32("M_UnitProductionMultiplier") as Entity,

  Encryption: toHex32("R_Encryption") as Entity,
  HP: toHex32("R_HP") as Entity,

  IronPlate: toHex32("IronPlate") as Entity,

  HammerDrone: toHex32("HammerDrone") as Entity,
  StingerDrone: toHex32("StingerDrone") as Entity,
  AnvilDrone: toHex32("AnvilDrone") as Entity,
  AegisDrone: toHex32("AegisDrone") as Entity,
  ColonyShip: toHex32("ColonyShip") as Entity,
  Droid: toHex32("Droid") as Entity,

  MinutemanMarine: toHex32("MinutemanMarine") as Entity,
  TridentMarine: toHex32("TridentMarine") as Entity,
  LightningCraft: toHex32("LightningCraft") as Entity,

  Expansion: toHex32("Expansion") as Entity,

  // Leaderboards
  PlayerShardLeaderboard: toHex32("Player_Primodium") as Entity,
  PlayerWormholeLeaderboard: toHex32("Player_Wormhole") as Entity,
  PlayerGrandLeaderboard: toHex32("Player_Grand") as Entity,

  // Leaderboards
  AllianceShardLeaderboard: toHex32("Alliance_Primodium") as Entity,
  AllianceWormholeLeaderboard: toHex32("Alliance_Wormhole") as Entity,
  AllianceGrandLeaderboard: toHex32("Alliance_Grand") as Entity,

  // Objectives
  ...Object.keys(EObjectives).reduce((acc, key) => {
    if (!isNaN(Number(key))) return acc;
    return { ...acc, [key]: toHex32(key) as Entity };
  }, {}),

  // Starmap
  Asteroid: toHex32("spacerock.Asteroid") as Entity,

  NULL: toHex32("NULL") as Entity,
};

/** Used in DEX protocol. All bonding curves pair with the Reserve resource. */
export const RESERVE_RESOURCE = EntityType.Kimberlite;

/** All resources in the game. */
export const ResourceStorages = new Set([
  EntityType.Iron,
  EntityType.Copper,
  EntityType.Lithium,
  EntityType.IronPlate,
  EntityType.Alloy,
  EntityType.PVCell,
  EntityType.Titanium,
  EntityType.Iridium,
  EntityType.Platinum,
  EntityType.Kimberlite,
]);

/** All utilities in the game. */
export const UtilityStorages = new Set([
  EntityType.Housing,
  EntityType.Electricity,
  EntityType.ColonyShipCapacity,
  EntityType.FleetCount,
  EntityType.Defense,
  EntityType.Unraidable,
  EntityType.AdvancedUnraidable,
]);

/** All units in the game. */
export const UnitStorages = new Set([
  EntityType.HammerDrone,
  EntityType.StingerDrone,
  EntityType.AnvilDrone,
  EntityType.AegisDrone,
  EntityType.ColonyShip,
  EntityType.Droid,
  EntityType.MinutemanMarine,
  EntityType.TridentMarine,
  EntityType.LightningCraft,
]);

/** All multipliers in the game. */
export const MultiplierStorages = new Set([EntityType.DefenseMultiplier]);
