import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import AKLogo from "./assets/AK_logo.png";
import Artboard from "./assets/Artboard.png";
import Undraw from "./assets/Undraw.png";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section className=" flex items-center justify-center h-screen relative bg-white">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <>
            <div className="bg-white w-fit mx-auto p-4 rounded-full">
                  <div className="w-[350px] h-[3 50px] relative mt-[-50px]">
                    <img className=" w-full p-10" src={Artboard} alt="artboard" />
                  </div>
                  <p className=" font-normal font-['Work Sans'] text-2xl flex justify-center items-center my-10">
                    Welcome to AdmitKard
                  </p>
                  <p className="text-stone-500 flex justify-center items-center my-10 ">
                  In order to provide you with a custom experience <span>we need to ask you a few questions</span>
                </p>
                  <button                
                    className="bg-amber-300 hover:bg-amber-400 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded my-5"
                  >
                    <span>Get Started</span>
                  </button>
                  <p className="text-stone-200 flex justify-center items-center ">
                 *This will only take 5 min.
                </p>
                </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 rounded-lg p-4">
            {showOTP ? (
              <>
                <div className="bg-white w-fit mx-auto p-4 rounded-full">
                  <div className="w-[250px] h-[250px] relative mt-[-50px]">
                    <img className=" w-full p-10" src={Undraw} alt="undraw" />
                  </div>
                  <h1 className=" text-2xl flex justify-center items-center">
                   Welcome to AdmitKard
                </h1>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    OTPLength={6}      
                    otpType="number"
                    disabled={false}
                    autoFocus
                    className="opt-container mb-5 align-center"
                  ></OtpInput>
                  <button
                    onClick={onOTPVerify}
                    className="bg-amber-300 hover:bg-amber-400 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Verify</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
                <img className="w-[264px] h-[50px] " src={AKLogo} alt="logo" />
                <h1 className=" text-2xl flex justify-center items-center">
                  Welcome Back
                </h1>
                <p className="text-stone-500 flex justify-center items-center ">
                  Please sign in to your account
                </p>
                <PhoneInput
                  country={"in"}
                  value={ph}
                  onChange={setPh}
                  className=" h-15 rounded-[5px] border border-amber-200 hover:border-amber-400"
                />

                <div className=" text-center text-neutral-400 text-xs font-normal mt-5 font-['Work Sans']">
                  We will send you a one time SMS message.
                  <br />
                  Charges may apply.
                </div>
                <button
                  onClick={onSignup}
                  className=" w-full flex gap-1 items-center justify-center mt-10 py-2.5 bg-amber-300 hover:bg-amber-400 rounded-[100px] text-white "
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Sign in with OTP</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
