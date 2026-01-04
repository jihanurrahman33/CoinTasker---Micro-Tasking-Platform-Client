import { auth } from "../../firebase/firebase.init";
import { AuthContext } from "./AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  //social login
  const googleSignIn = () => {
    return signInWithPopup(auth, provider);
  };

  const authInfo = { googleSignIn };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
