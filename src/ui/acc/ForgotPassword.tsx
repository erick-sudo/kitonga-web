import { useEffect, useState } from "react";
import { validateEmail } from "../definitions";
import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { RequestOTP } from "./RequestOtp";
import { NavLink } from "react-router-dom";
import { ResetPassword } from "./ResetPassword";

function PasswordStepperIconComponent({
  active,
  completed,
  icon,
}: {
  active?: boolean;
  completed?: boolean;
  icon: React.ReactNode;
}) {
  const icons: Record<string, JSX.Element> = {
    1: <EnvelopeIcon height={20} />,
    2: <KeyIcon height={20} />,
  };

  return (
    <div
      className={clsx(
        "relative -translate-x-3 flex items-center justify-center rounded-full",
        {
          "bg-gradient-to-tl from-teal-950 to-teal-400 text-white max-h-10 max-w-10 min-h-10 min-w-10 m-2":
            active,
          "bg-gradient-to-tl from-teal-950 to-teal-400 text-white max-h-12 max-w-12 min-h-12 min-w-12":
            completed,
          "bg-gradient-to-tl from-stone-950 to-stone-400 text-white max-h-12 max-w-12 min-h-12 min-w-12":
            !active && !completed,
        }
      )}
    >
      <div
        className={clsx("", {
          "block absolute -inset-2 border-1 rounded-full border-teal-700":
            active,
        })}
      ></div>
      {icons[String(icon)]}
    </div>
  );
}

export const PASSWORD_RESET_STEPS = {
  REQUEST_OTP: 0,
  CREATE_NEW_PASSWORD: 1,
};

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState(null);
  const [step, setStep] = useState(1) // PASSWORD_RESET_STEPS.REQUEST_OTP);

  useEffect(() => {
    const cachedEmail = sessionStorage.getItem("forgot-password-email");
    if (cachedEmail) {
      setEmail(cachedEmail);
    }
  }, []);

  useEffect(() => {
    if (email) {
      validateEmail(email).then((res) => {
        setErrors(res);
      });
    }
  }, [email]);

  return (
    <div className="">
      <div className="max-w-sm mx-auto grid gap-4 p-4">
        <div className="flex justify-center"></div>
        <div className="">
          <Typography className="text-teal-800" component="h1" variant="h5">
            Forgot password
          </Typography>
        </div>

        <Stepper activeStep={step} orientation="vertical">
          {/* Request OTP */}
          <Step>
            <StepLabel
              sx={{
                "& .Mui-active, .Mui-completed": {
                  color: "rgb(126 34 206)",
                },
              }}
              StepIconComponent={PasswordStepperIconComponent}
            >
              Request One Time Password
            </StepLabel>
            <StepContent>
              <RequestOTP
                state={[email, setEmail]}
                onSuccess={() => {
                  setStep(PASSWORD_RESET_STEPS.CREATE_NEW_PASSWORD);
                }}
              />
              <div className="pt-4">
                You have code?&nbsp;
                <button
                  disabled={Boolean(errors) || !Boolean(email)}
                  onClick={() =>
                    setStep(PASSWORD_RESET_STEPS.CREATE_NEW_PASSWORD)
                  }
                  className="text-teal-700 hover:text-teal-800 duration-300 disabled:text-gray-300"
                >
                  Verify
                </button>
              </div>
            </StepContent>
          </Step>

          {/* Reset Password */}
          <Step>
            <StepLabel
              sx={{
                "& .Mui-active, .Mui-completed": {
                  color: "rgb(126 34 206)",
                },
              }}
              StepIconComponent={PasswordStepperIconComponent}
            >
              Create new password
            </StepLabel>
            <StepContent>
              <ResetPassword email={email} setStep={setStep} />
            </StepContent>
          </Step>
        </Stepper>

        <NavLink to="/sign-in" className="mx-auto text-sm text-teal-800 hover:text-teal-700 duration-300">
          Back To Login
        </NavLink>
      </div>
    </div>
  );
};
