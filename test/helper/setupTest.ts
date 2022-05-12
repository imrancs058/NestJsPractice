import {RoleType} from "../../src/constants";
import { UserService} from '../../src/modules/user/user.service'
import { AuthService} from '../../src/modules/auth/auth.service'
import { User, UserSchema } from '../../src/modules/user/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
const mongoose = require('mongoose');
import { ConfigModule } from '@nestjs/config'
import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { ConfigrationModule } from '../../src/configration/configration.module';
import { ConfigrationService } from '../../src/configration/configration.service';
import { newUser } from './users';
let token={};
export const adminToken=()=>{
    return token;
}
const setupTestDB = () => {
    beforeAll(async () => {
        var db = await mongoose.connect(process.env.MONGODB_URI);
        const module: TestingModule = await Test.createTestingModule({
            imports: [
              ConfigModule.forRoot({
                isGlobal: true,
                cache: true
              }),
              MongooseModule.forRootAsync({
                imports: [ConfigrationModule],
                useFactory: async (configService: ConfigrationService) => (
                  configService.mongooseConfig
                ),
                inject: [ConfigrationService],
              }),
              MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])//-------import model here
            ],
            providers: [UserService,AuthService]
          }).compile()
          const service = module.get<UserService>(UserService)
          const authService = module.get<AuthService>(AuthService)
          let userTest = newUser()
          await service.createUser(userTest)
          token=await authService.createAccessToken(userTest);

    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });
};

module.exports = setupTestDB;
