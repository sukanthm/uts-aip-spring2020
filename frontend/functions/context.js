import { createContext } from 'react';

// Context for setting global values to be used across the React application
// Context method inspired from https://reacttricks.com/sharing-global-data-in-next-with-custom-app-and-usecontext-hook/
const UserContext = createContext();

export default UserContext;