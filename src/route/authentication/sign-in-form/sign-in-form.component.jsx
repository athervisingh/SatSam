import { useEffect, useState } from "react";
import {
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
} from "../../../utils/firebase/firebase.utils";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; 
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useSelector } from "react-redux";

const SignInForm = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formFields;

  const resetFormFields = () => {
    setFormFields({ email: "", password: "" });
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithGooglePopup();
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInAuthUserWithEmailAndPassword(email, password);
      resetFormFields();
    } catch (error) {
      console.error("User sign in failed", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  const [showPassword, setShowPassword] = useState(false);

  return (
    // <div className="min-h-screen min-w-screen flex justify-center ">
    <div className="max-w-md mx-auto mt-12 p-8 bg-auth-bg rounded-lg shadow-xl">
      <div className="flex items-center space-x-4 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-auth-hover-prevBtn"
      >
        <ArrowLeft size={24} />
      </button>
      <h2 className="text-xl sm:text-2xl font-bold text-auth-head-text flex-grow text-center">
        Sign In to Your Account
      </h2>
    </div>

  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-auth-label"
      >
        Email Address
      </label>
      <input
        id="email"
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        required
        placeholder="Enter your email"
        className="w-full px-4 py-2 mt-2 bg-auth-inpBg border border-auth-inpBor rounded-md focus:outline-none focus:ring-2 focus:ring-auth-focRing"
      />
    </div>
    <div className="relative">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-auth-label"
      >
        Password
      </label>
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={password}
        onChange={handleChange}
        required
        placeholder="Enter your password"
        className="w-full px-4 py-2 pr-[2.8rem] mt-2 bg-auth-inpBg border border-auth-inpBor rounded-md focus:outline-none focus:ring-2 focus:ring-auth-focRing"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-[3.1rem] transform -translate-y-1/2 text-auth-muted"
      >
        {showPassword ? (
          <AiFillEye size={22} />
        ) : (
          <AiFillEyeInvisible size={22} />
        )}
      </button>
      <div className="text-right mt-2 text-auth-SBtn text-[0.8rem]">
        <Link to="/forgot-password" className="text-auth-link hover:underline">
          Forgot your password?
        </Link>
      </div>
    </div>
    <button
      type="submit"
      className="w-full py-2 !mt-2 text-auth-whiteText bg-auth-SBtn rounded-md hover:bg-auth-hover-focRing focus:outline-none focus:ring-2 focus:ring-auth-focRing"
    >
      Sign In
    </button>
  </form>
  <div className="my-4">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-auth-inpBor"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-auth-bg px-2 text-auth-muted">
          Or continue with
        </span>
      </div>
    </div>
  </div>
  <button
    type="button"
    onClick={signInWithGoogle}
    className="w-full py-2 px-4 bg-auth-inpBg text-auth-label border border-auth-inpBor rounded-md hover:bg-auth-hover-GBtn focus:outline-none flex items-center justify-center space-x-2"
  >
    <svg className="w-5 h-5 text-auth-icon-GBtn" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
      />
    </svg>
    <span className="text-auth-muted">Sign In with Google</span>
  </button>
  <div className="mt-6 text-center text-sm text-auth-muted">
    Don&apos;t have an account?{" "}
    <Link
      to="/auth/sign-up"
      className="text-auth-SBtn hover:underline font-medium"
    >
      Create one
    </Link>
  </div>
</div>

    // </div>
  );
};

export default SignInForm;
