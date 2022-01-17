
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum CatTypeEnum {
    TYPE1 = "TYPE1",
    TYPE2 = "TYPE2",
    TYPE3 = "TYPE3"
}

export enum Classification {
    UNCLAS = "UNCLAS",
    SENSI = "SENSI",
    CONFID = "CONFID",
    SEC = "SEC",
    TSEC = "TSEC",
    INTEL = "INTEL"
}

export enum StorageLocationsEnum {
    NORTH = "NORTH",
    CENTER = "CENTER",
    SOUTH = "SOUTH"
}

export class CreateCatInput {
    name?: Nullable<string>;
    age?: Nullable<number>;
    ownerId?: Nullable<number>;
    type?: Nullable<CatTypeEnum>;
}

export class AddOfficeEquipment {
    isFragile?: Nullable<boolean>;
    name?: Nullable<string>;
    realityId: number;
    classification?: Nullable<Classification>;
    createdBy: string;
    creationTime: ZonedDateTime;
    dataVersion: BigInt;
    lastUpdateTime?: Nullable<ZonedDateTime>;
    lastUpdateBy?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isClassified?: Nullable<boolean>;
    secGroups?: Nullable<Nullable<string>[]>;
}

export interface BaseEntity {
    id: string;
    realityId: number;
    classification?: Nullable<Classification>;
    createdBy: string;
    creationTime: ZonedDateTime;
    dataVersion: BigInt;
    lastUpdateTime?: Nullable<ZonedDateTime>;
    lastUpdateBy?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isClassified?: Nullable<boolean>;
    secGroups?: Nullable<Nullable<string>[]>;
}

export interface BaseItem {
    name?: Nullable<string>;
    id: string;
    realityId: number;
    classification?: Nullable<Classification>;
    createdBy: string;
    creationTime: ZonedDateTime;
    dataVersion: BigInt;
    lastUpdateTime?: Nullable<ZonedDateTime>;
    lastUpdateBy?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isClassified?: Nullable<boolean>;
    secGroups?: Nullable<Nullable<string>[]>;
}

export abstract class IQuery {
    abstract cats(): Nullable<Nullable<Cat>[]> | Promise<Nullable<Nullable<Cat>[]>>;

    abstract cat(id: string): Nullable<Cat> | Promise<Nullable<Cat>>;

    abstract items(): Nullable<Item>[] | Promise<Nullable<Item>[]>;
}

export abstract class IMutation {
    abstract createCat(createCatInput?: Nullable<Nullable<CreateCatInput>[]>): Nullable<Nullable<Cat>[]> | Promise<Nullable<Nullable<Cat>[]>>;

    abstract addOfficeEquipment(input: Nullable<AddOfficeEquipment>[]): Nullable<Nullable<OfficeEquipment>[]> | Promise<Nullable<Nullable<OfficeEquipment>[]>>;
}

export abstract class ISubscription {
    abstract catCreated(): Nullable<Cat> | Promise<Nullable<Cat>>;
}

export class Owner {
    id: number;
    name: string;
    age?: Nullable<number>;
    cats?: Nullable<Cat[]>;
}

export class Cat {
    id?: Nullable<number>;
    name?: Nullable<string>;
    age?: Nullable<number>;
    owner?: Nullable<Owner>;
    type?: Nullable<CatTypeEnum>;
}

export class OfficeEquipment implements Item {
    isFragile?: Nullable<boolean>;
    name?: Nullable<string>;
    id: string;
    realityId: number;
    classification?: Nullable<Classification>;
    createdBy: string;
    creationTime: ZonedDateTime;
    dataVersion: BigInt;
    lastUpdateTime?: Nullable<ZonedDateTime>;
    lastUpdateBy?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isClassified?: Nullable<boolean>;
    secGroups?: Nullable<Nullable<string>[]>;
}

export class OfficeForniture implements Item {
    isWood?: Nullable<boolean>;
    name?: Nullable<string>;
    id: string;
    realityId: number;
    classification?: Nullable<Classification>;
    createdBy: string;
    creationTime: ZonedDateTime;
    dataVersion: BigInt;
    lastUpdateTime?: Nullable<ZonedDateTime>;
    lastUpdateBy?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isClassified?: Nullable<boolean>;
    secGroups?: Nullable<Nullable<string>[]>;
}

export class Software implements Item {
    isOpenSource?: Nullable<boolean>;
    name?: Nullable<string>;
    id: string;
    realityId: number;
    classification?: Nullable<Classification>;
    createdBy: string;
    creationTime: ZonedDateTime;
    dataVersion: BigInt;
    lastUpdateTime?: Nullable<ZonedDateTime>;
    lastUpdateBy?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isClassified?: Nullable<boolean>;
    secGroups?: Nullable<Nullable<string>[]>;
}

export class Container implements BaseEntity {
    items: Nullable<Item>[];
    location: StorageLocation;
    id: string;
    realityId: number;
    classification?: Nullable<Classification>;
    createdBy: string;
    creationTime: ZonedDateTime;
    dataVersion: BigInt;
    lastUpdateTime?: Nullable<ZonedDateTime>;
    lastUpdateBy?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isClassified?: Nullable<boolean>;
    secGroups?: Nullable<Nullable<string>[]>;
}

export class StorageLocation implements BaseEntity {
    location: StorageLocationsEnum;
    id: string;
    realityId: number;
    classification?: Nullable<Classification>;
    createdBy: string;
    creationTime: ZonedDateTime;
    dataVersion: BigInt;
    lastUpdateTime?: Nullable<ZonedDateTime>;
    lastUpdateBy?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isClassified?: Nullable<boolean>;
    secGroups?: Nullable<Nullable<string>[]>;
}

export type ZonedDateTime = any;
export type BigInt = any;
export type Item = OfficeEquipment | OfficeForniture | Software;
type Nullable<T> = T | null;
