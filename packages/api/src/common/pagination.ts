import { BaseEntity } from './base-entity';

export async function paginatedToResponse(
  paginated: Promise<[BaseEntity<any>[], number]>,
) {
  const [entities, total] = await paginated;
  return {
    entities,
    total,
  };
}
