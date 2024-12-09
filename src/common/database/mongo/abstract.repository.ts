import { Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  ProjectionType,
  Types,
  UpdateQuery,
} from 'mongoose';
import { AbstractDocument } from './abstract.entity';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    document: TDocument & { _id?: string | Types.ObjectId },
  ): Promise<TDocument> {
    const _id = document._id ? document._id : new Types.ObjectId();
    const documentToCreate = new this.model({
      ...document,
      _id,
    });

    const createdDocument = await documentToCreate.save();

    return createdDocument.toJSON() as TDocument;
  }
  async findOne(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    try {
      const document = await this.model
        .findOne(filterQuery)
        .lean<TDocument>(true);

      if (!document) {
        this.logger.warn(
          'Document was not found with filterQuery',
          filterQuery,
        );
        return null;
      }

      return document;
    } catch (error) {
      this.logger.error('Error finding document:', error);
      throw new NotFoundException('Document could not be found');
    }
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }
    return document;
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
  ): Promise<TDocument[]> {
    return this.model.find(filterQuery, projection).lean<TDocument[]>(true);
  }
}
