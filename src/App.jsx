import "./App.css";
import Navigation from "./route/navigation/navigation.component";
import { Routes, Route } from "react-router-dom";
import { setCurrentUser } from "./store/user/user.reducer";
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from "./utils/firebase/firebase.utils";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SignUpForm from "./route/authentication/sign-up-form/sign-up-form.component";
import SignInForm from "./route/authentication/sign-in-form/sign-in-form.component";
import ForgotPassword from "./route/authentication/forgetPassword/forgetPassword.component";
import MapPage from "./route/mapPage/mapPage";
import UploadImagePage from "./route/UploadImagePage/UploadImagePage";
function App() {
  
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      const pickedUser =
        user && (({ accessToken, email }) => ({ accessToken, email }))(user);

      // console.log(setCurrentUser(pickedUser));
      dispatch(setCurrentUser(pickedUser));
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<MapPage />} />
          <Route path="/auth/sign-in" element={<SignInForm />} />
          <Route path="/auth/sign-up" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/imageUpload" element={<UploadImagePage />} />
          
        </Route>
      </Routes>
    </>
  );
}

export default App;
