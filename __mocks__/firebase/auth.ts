export const getAuth = jest.fn(() => ({
  currentUser: {
    getIdToken: jest.fn(async () => ''),
    displayName: 'Testing user',
  },
}));

export const connectAuthEmulator = jest.fn();
export const GoogleAuthProvider = jest.fn().mockImplementation();
export const EmailAuthProvider = jest.fn().mockImplementation();
