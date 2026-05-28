import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
<<<<<<< HEAD
    return { message: 'Welcome to api!' };
=======
    return ({ message: 'Hello API' });
>>>>>>> 06855b28cb43ac230f32336c71b9fadf3707e625
  }
}
