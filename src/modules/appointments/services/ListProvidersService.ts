import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    // let therapists = await this.cacheProvider.recover<User[]>(
    //   `providers-list:${user_id}`,
    // );

    let therapists = null;

    if (!therapists) {
      therapists = await this.usersRepository.findAllTherapists({
        except_user_id: user_id,
      });
      console.log('teste');
      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(therapists),
      );
    }

    return therapists;
  }
}

export default ListProvidersService;
