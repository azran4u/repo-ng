export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
  ZonedDateTime: any;
}

export interface AbstractItem {
  classification?: Maybe<ClassificationEnum>;
  createdBy: Scalars['String'];
  creationTime: Scalars['ZonedDateTime'];
  dataVersion: Scalars['BigInt'];
  id: Scalars['String'];
  isClassified?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastUpdateBy?: Maybe<Scalars['String']>;
  lastUpdateTime?: Maybe<Scalars['ZonedDateTime']>;
  name?: Maybe<Scalars['String']>;
  realityId: Scalars['Int'];
  secGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
}

export interface AddOfficeEquipment {
  classification?: InputMaybe<ClassificationEnum>;
  createdBy: Scalars['String'];
  creationTime: Scalars['ZonedDateTime'];
  dataVersion: Scalars['BigInt'];
  isClassified?: InputMaybe<Scalars['Boolean']>;
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  isFragile?: InputMaybe<Scalars['Boolean']>;
  lastUpdateBy?: InputMaybe<Scalars['String']>;
  lastUpdateTime?: InputMaybe<Scalars['ZonedDateTime']>;
  name?: InputMaybe<Scalars['String']>;
  realityId: Scalars['Int'];
  secGroups?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
}

export interface BaseEntity {
  classification?: Maybe<ClassificationEnum>;
  createdBy: Scalars['String'];
  creationTime: Scalars['ZonedDateTime'];
  dataVersion: Scalars['BigInt'];
  id: Scalars['String'];
  isClassified?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastUpdateBy?: Maybe<Scalars['String']>;
  lastUpdateTime?: Maybe<Scalars['ZonedDateTime']>;
  realityId: Scalars['Int'];
  secGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
}

export interface Cat {
  __typename?: 'Cat';
  age?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Owner>;
  type?: Maybe<CatTypeEnum>;
}

export enum CatTypeEnum {
  Type1 = 'TYPE1',
  Type2 = 'TYPE2',
  Type3 = 'TYPE3'
}

export enum ClassificationEnum {
  Confid = 'CONFID',
  Intel = 'INTEL',
  Sec = 'SEC',
  Sensi = 'SENSI',
  Tsec = 'TSEC',
  Unclas = 'UNCLAS'
}

export interface Container extends BaseEntity {
  __typename?: 'Container';
  classification?: Maybe<ClassificationEnum>;
  createdBy: Scalars['String'];
  creationTime: Scalars['ZonedDateTime'];
  dataVersion: Scalars['BigInt'];
  id: Scalars['String'];
  isClassified?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  items: Array<Maybe<Item>>;
  lastUpdateBy?: Maybe<Scalars['String']>;
  lastUpdateTime?: Maybe<Scalars['ZonedDateTime']>;
  location: StorageLocation;
  realityId: Scalars['Int'];
  secGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
}

export interface CreateCatInput {
  age?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  ownerId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<CatTypeEnum>;
}

export type Item = OfficeEquipment | OfficeForniture | Software;

export interface Mutation {
  __typename?: 'Mutation';
  addOfficeEquipment?: Maybe<Array<Maybe<OfficeEquipment>>>;
  createCat?: Maybe<Array<Maybe<Cat>>>;
}


export interface MutationAddOfficeEquipmentArgs {
  input: Array<InputMaybe<AddOfficeEquipment>>;
}


export interface MutationCreateCatArgs {
  createCatInput?: InputMaybe<Array<InputMaybe<CreateCatInput>>>;
}

export interface OfficeEquipment extends AbstractItem {
  __typename?: 'OfficeEquipment';
  classification?: Maybe<ClassificationEnum>;
  createdBy: Scalars['String'];
  creationTime: Scalars['ZonedDateTime'];
  dataVersion: Scalars['BigInt'];
  id: Scalars['String'];
  isClassified?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  isFragile?: Maybe<Scalars['Boolean']>;
  lastUpdateBy?: Maybe<Scalars['String']>;
  lastUpdateTime?: Maybe<Scalars['ZonedDateTime']>;
  name?: Maybe<Scalars['String']>;
  realityId: Scalars['Int'];
  secGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
}

export interface OfficeForniture extends AbstractItem {
  __typename?: 'OfficeForniture';
  classification?: Maybe<ClassificationEnum>;
  createdBy: Scalars['String'];
  creationTime: Scalars['ZonedDateTime'];
  dataVersion: Scalars['BigInt'];
  id: Scalars['String'];
  isClassified?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  isWood?: Maybe<Scalars['Boolean']>;
  lastUpdateBy?: Maybe<Scalars['String']>;
  lastUpdateTime?: Maybe<Scalars['ZonedDateTime']>;
  name?: Maybe<Scalars['String']>;
  realityId: Scalars['Int'];
  secGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
}

export interface Owner {
  __typename?: 'Owner';
  age?: Maybe<Scalars['Int']>;
  cats?: Maybe<Array<Cat>>;
  id: Scalars['Int'];
  name: Scalars['String'];
}

export interface Query {
  __typename?: 'Query';
  cat?: Maybe<Cat>;
  cats?: Maybe<Array<Maybe<Cat>>>;
  items: Array<Maybe<Item>>;
}


export interface QueryCatArgs {
  id: Scalars['ID'];
}

export interface Software extends AbstractItem {
  __typename?: 'Software';
  classification?: Maybe<ClassificationEnum>;
  createdBy: Scalars['String'];
  creationTime: Scalars['ZonedDateTime'];
  dataVersion: Scalars['BigInt'];
  id: Scalars['String'];
  isClassified?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  isOpenSource?: Maybe<Scalars['Boolean']>;
  lastUpdateBy?: Maybe<Scalars['String']>;
  lastUpdateTime?: Maybe<Scalars['ZonedDateTime']>;
  name?: Maybe<Scalars['String']>;
  realityId: Scalars['Int'];
  secGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
}

export interface StorageLocation extends BaseEntity {
  __typename?: 'StorageLocation';
  classification?: Maybe<ClassificationEnum>;
  createdBy: Scalars['String'];
  creationTime: Scalars['ZonedDateTime'];
  dataVersion: Scalars['BigInt'];
  id: Scalars['String'];
  isClassified?: Maybe<Scalars['Boolean']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastUpdateBy?: Maybe<Scalars['String']>;
  lastUpdateTime?: Maybe<Scalars['ZonedDateTime']>;
  location: StorageLocationsEnum;
  realityId: Scalars['Int'];
  secGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
}

export enum StorageLocationsEnum {
  Center = 'CENTER',
  North = 'NORTH',
  South = 'SOUTH'
}

export interface Subscription {
  __typename?: 'Subscription';
  catCreated?: Maybe<Cat>;
}
