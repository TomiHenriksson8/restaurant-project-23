
interface User {
    _id: string;
    username: string;
    favouriteRestaurant: string;
    avatar: string;
    role: string;
    email: string;
  }
  
  interface LoginUser {
    message: string;
    token: string;
    data: User;
  }
  
  interface UpdateUser {
    username: string;
    email: string;
  }

  interface SignUpResult {
    message: string;
    data: User;
  }
  
  export type {User, LoginUser, UpdateUser, SignUpResult};
  