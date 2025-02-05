
export const ENDPOINTS = {
  login: 'https://fakestoreapi.com/auth/login',
  getAllUsers: 'http://localhost:3000/users',
  getUser: 'https://fakestoreapi.com/users/',
  getAllCategories: 'http://localhost:3000/categories',
  getAllProducts: 'http://localhost:3000/products',
  getAllShoppingCarts: 'http://localhost:3000/carts',
  getAllSales: 'http://localhost:3000/sales',
  getAllFavoriteProducts: 'http://localhost:3000/favorites',
  getAllPlatziProducts: 'https://api.escuelajs.co/api/v1/products',
  getAllPlatziCategories: 'https://api.escuelajs.co/api/v1/categories',
  getUsersRandom: 'http://localhost:3000/team',
  getTestimonialsMock: '/core/mocks/mock-data.ts',
};

export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password must be at least 6 characters long',
  username: 'Username must be at least 6 characters long',
  passwordMatch: 'Passwords do not match',
  invalidCredentials: 'Invalid credentials',
  usernameTaken: 'Username is already taken',
  emailTaken: 'Email is already taken',
  userNotFound: 'User not found',
  userNotAuthenticated: 'User is not authenticated',
  userNotAuthorized: 'User is not authorized',
  userNotLoggedIn: 'User is not logged in',
  userNotRegistered: 'User is not registered',
  userNotVerified: 'User is not verified',
  userNotDeleted: 'User could not be deleted',
  userNotUpdated: 'User could not be updated',
  userNotCreated: 'User could not be created',
  userNotRetrieved: 'User could not be retrieved',
  userNotSaved: 'User could not be saved',
  userNotSent: 'User could not be sent',
  userNotReceived: 'User could not be received',
  userNotLoaded: 'User could not be loaded',
  userNotReset: 'User could not be reset',
  userNotAdded: 'User could not be added',
  userNotRemoved: 'User could not be removed'

}
