import { user } from './interfaces/users.interfaces';

declare global {
    namespace Express {
        interface Request {
            user?: user;
        }
    }
}
