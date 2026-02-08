import { onAuthStateChange, User } from "@junobuild/core";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { LoginWitII } from "./LoginWitII.tsx";
import { Logout } from "./Logout";
import { Passkey } from "./passkey/Passkey.tsx";

export const AuthContext = createContext<{ user: User | null }>({ user: null });

export const Auth: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sub = onAuthStateChange((user) => setUser(user));

    return () => sub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {user !== null ? (
        <div>
          {children}

          <Logout />
        </div>
      ) : (
        <div className="gap flex flex-col">
          <Passkey />
          <LoginWitII />
        </div>
      )}
    </AuthContext.Provider>
  );
};
