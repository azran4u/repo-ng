import { Container } from "../../generated/graphql";

export interface ContainerWithReferences extends Container {
  storage_locations_id: string;
}
