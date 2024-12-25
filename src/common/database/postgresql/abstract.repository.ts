import { FindOptionsRelations, Repository } from 'typeorm';

// errors
import { EntityNotFoundError } from '@app/common/errors';
import { AbstractEntity } from './abstract.entity';

export class AbstractRepository<
  E extends AbstractEntity<E>,
> extends Repository<E> {
  /**
   * If the passed param is an id it looks for the record
   * otherwise return the entitys
   * @param entityRecordOrEntityRecordId Entity Id or Entity
   * @returns Entity
   */
  public async findEntityData(
    entityRecordOrEntityRecordId: E['id'] | E,
    relations?: FindOptionsRelations<E>,
  ): Promise<E> {
    if (typeof entityRecordOrEntityRecordId === 'string') {
      const data = await this.findOne({
        // @ts-expect-error Typeorm cant differentiate the types
        where: {
          id: entityRecordOrEntityRecordId,
        },
        relations,
      });
      if (!data) throw new EntityNotFoundError(this.metadata.name);
      return data;
    }
    return entityRecordOrEntityRecordId;
  }
}
