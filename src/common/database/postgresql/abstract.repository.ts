import { Repository } from 'typeorm';

// errors
import { NotFoundError } from '@app/common/errors';
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
  ): Promise<E> {
    if (typeof entityRecordOrEntityRecordId === 'string') {
      // @ts-expect-error Typeorm cant differentiate the types
      const data = await this.findOneBy({ id: entityRecordOrEntityRecordId });
      if (!data) throw new NotFoundError(this.metadata.name);
      return data;
    }
    return entityRecordOrEntityRecordId;
  }
}
