import { getRepository, Repository, Not } from 'typeorm';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';

import User from '../entities/User';

class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }

  public async findAllUsers({
    except_user_id,
  }: IFindAllUsersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }
    return users;
  }

  public async findAllTherapists({
    except_user_id,
  }: IFindAllUsersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
          is_therapist: true,
        },
      });
    } else {
      users = await this.ormRepository.find();
    }
    return users;
  }

  public async create({
    name,
    email,
    password,
    is_therapist,
  }: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create({
      name,
      email,
      password,
      is_therapist,
    });

    await this.ormRepository.save(appointment);
    return appointment;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
