import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { selectCurrentUser } from "../../../store/user/user.selector";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
} from "../../../utils/firebase/firebase.utils";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "sonner";
const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
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

    if (password !== confirmPassword) {
      // alert("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        // alert("Email already in use. Try logging in.");
        toast.error("Account already exist.")
      } else {
        console.error("Error creating user", error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    // <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-800 to-gray-900 flex  justify-center ">
    <div className="max-w-md mx-auto p-6 mt-5 bg-auth-bg rounded-lg shadow-xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-auth-inpBg rounded-full transition duration-200"
        >
          <ArrowLeft size={24} className="text-auth-label" />
        </button>
        <h2 className="text-2xl font-bold text-auth-head-text flex-grow text-center ">
          Create your Account
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-auth-label"
            >
              Username
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              className="block w-full mt-1 px-4 py-2 border rounded-md focus:ring-auth-focRing bg-auth-inpBg border-auth-inpBor sm:text-sm"
              placeholder="Enter your Username"
              value={displayName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-auth-label"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full mt-1 px-4 py-2 border rounded-md focus:ring-auth-focRing bg-auth-inpBg border-auth-inpBor sm:text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
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
              name="password"
              type={`${showPassword ? "text" : "password"}`}
              required
              className="block w-full mt-1 px-4 py-2 pr-[2.8rem] border rounded-md bg-auth-inpBg border-auth-inpBor focus:ring-auth-focRing sm:text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[2.7rem] transform -translate-y-1/2 text-auth-muted"
            >
              {showPassword ? (
                <AiFillEye size={22} />
              ) : (
                <AiFillEyeInvisible size={22} />
              )}
            </button>
          </div>
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-auth-label"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={`${showConfirm ? "text" : "password"}`}
              required
              className="block w-full mt-1 px-4 py-2 pr-[2.8rem] border rounded-md bg-auth-inpBg border-auth-inpBor focus:ring-auth-focRing sm:text-sm"
              placeholder="Enter confirm password"
              value={confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-[2.7rem] transform -translate-y-1/2 text-auth-muted"
            >
              {showConfirm ? (
                <AiFillEye size={22} />
              ) : (
                <AiFillEyeInvisible size={22} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 bg-auth-SBtn text-auth-whiteText font-medium rounded-lg shadow-md hover:bg-auth-hover-focRing focus:outline-none focus:ring-2 focus:ring-auth-SBtn focus:ring-offset-2 transition duration-200"
        >
          {/* {isSubmitting ? "Signing Up..." : "Sign Up"} */}
          Sign Up
        </button>
      </form>

      <div className="mt-3">
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

        <button
          onClick={signInWithGoogle}
          className="w-full mt-3 flex items-center justify-center px-4 py-2 border rounded-lg shadow-md bg-auth-bg hover:bg-auth-hover-GBtn focus:outline-none focus:ring-2 focus:ring-auth-focRing focus:ring-offset-2 transition duration-200"
        >
          <svg className="w-5 h-5 mr-2 text-auth-icon-GBtn" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          <span className="text-auth-muted">Sign up with Google</span>
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-auth-label">
        Already have an account?{" "}
        <Link
          to="/auth/sign-up"
          className="text-auth-SBtn hover:underline font-medium"
        >
          Sign In
        </Link>
      </p>
    </div>

    //  </div>
    //  </div>
  );
};

export default SignUpForm;
