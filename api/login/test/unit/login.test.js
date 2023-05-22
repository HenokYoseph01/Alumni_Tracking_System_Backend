const Login = require('../Login');
const createToken = require('../../utils/createToken');
const comparePassword = require('../../utils/comparePassword');
const { login } = require('../controller');

// Mock request and response objects
const req = {
  body: {
    email: 'test@example.com',
    password: 'password123'
  }
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

describe('Login Controller', () => {
  // Mock user object to be returned by Login.userLogin
  const user = {
    id: 1,
    role: 'alumni',
    password: '$2b$10$QCbsjKtufLyxkxHJr9hfa.8AKDfjzAEDbPvJpxwtkMhLsKnAlxub2'
  };

  // Mock Login.userLogin function
  Login.userLogin = jest.fn().mockReturnValue(user);

  // Mock Login.getSingleAlumni function
  Login.getSingleAlumni = jest.fn().mockReturnValue({
    id: 1
  });

  // Mock createToken function
  createToken = jest.fn().mockReturnValue('mockToken');

  // Mock comparePassword function
  comparePassword = jest.fn().mockReturnValue(true);

  beforeEach(() => {
    // Clear mock function calls before each test
    jest.clearAllMocks();
  });

  test('should return error if email or password is not provided', async () => {
    req.body.email = '';
    req.body.password = '';

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Wrong Credentials' });
  });

  test('should return error if user does not exist', async () => {
    Login.userLogin = jest.fn().mockReturnValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Wrong Credentials' });
  });

  test('should return error if password is incorrect', async () => {
    comparePassword = jest.fn().mockReturnValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Wrong Credentials' });
  });

  test('should create token and return success message for alumni', async () => {
    user.role = 'alumni';

    await login(req, res);

    expect(Login.getSingleAlumni).toHaveBeenCalledWith(user.id);
    expect(createToken).toHaveBeenCalledWith({ id: 1, role: 'Alumni' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'SUCCESS',
      message: 'Successfully logged in',
      role: 'alumni',
      userToken: 'mockToken'
    });
  })});
