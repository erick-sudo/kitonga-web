import { LoadingButton } from "@mui/lab";
import {
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputOtp, InputOtpChangeEvent } from "primereact/inputotp";
import { PASSWORD_RESET_STEPS } from "./ForgotPassword";
import { ReactStateSetter } from "../definitions";
import { axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { MUI_STYLES } from "../../lib/MUI_STYLES";

export function ResetPassword({
  email,
  setStep,
}: {
  email: string;
  setStep: ReactStateSetter<number>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string | number>("");
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });
  const [status, setStatus] = useState<{
    severity: "" | "success" | "error";
    message: string;
  }>({
    severity: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    axiosPost(APIS.account.changePassword, {
      new_password: formData.password,
      confirm_new_password: formData.confirm_password,
      email: email,
      otp: otp,
    })
      .then((response) => {
        setStatus({ severity: "success", message: response.data.message });
        setFormData({
          password: "",
          confirm_password: "",
        });
        setOtp("");
      })
      .catch((error) => {
        if (typeof error?.response?.data?.error === "string") {
          setStatus({ severity: "error", message: error.response.data.error });
        } else {
          setStatus({ severity: "error", message: error.message });
        }
      })
      .finally(() => {
        setLoading(false);
        sessionStorage.removeItem("forgot-password-email");
      });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="">
      <div className="">
        {status.severity && (
          <Alert severity={status.severity}>{status.message}</Alert>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <TextField
              name="password"
              size="small"
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 0,
                  backgroundColor: "rgba(0, 0, 0, 0)",
                },
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiFilledInput-root:hover": {
                  // Background color on hover
                  backgroundColor: "rgba(0, 0, 0, 0)",
                },
                "& .MuiFilledInput-underline:before": {
                  // Underline color
                  border: "none",
                },
                "& .MuiFilledInput-underline:after": {
                  // Color when focused
                  border: "none",
                },
                "& .MuiFilledInput-underline:hover:before": {
                  // Hover color
                  border: "none",
                },
              }}
              variant="filled"
              required
              fullWidth
              value={formData.password}
              onChange={handleChange}
              label="New Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <TextField
              name="confirm_password"
              size="small"
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 0,
                  backgroundColor: "rgba(0, 0, 0, 0)",
                },
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiFilledInput-root:hover": {
                  // Background color on hover
                  backgroundColor: "rgba(0, 0, 0, 0)",
                },
                "& .MuiFilledInput-underline:before": {
                  // Underline color
                  border: "none",
                },
                "& .MuiFilledInput-underline:after": {
                  // Color when focused
                  border: "none",
                },
                "& .MuiFilledInput-underline:hover:before": {
                  // Hover color
                  border: "none",
                },
              }}
              variant="filled"
              required
              fullWidth
              value={formData.confirm_password}
              onChange={handleChange}
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div>
            <h3 className="pb-4 text-teal-800 font-bold">Verification code</h3>
            <div className="w-max mx-auto">
              <InputOtp
                className="custom-otp-input-sample"
                integerOnly
                pt={{
                  input: {
                    className: "custom-otp-input-sample"
                  }
                }}
                value={otp}
                onChange={(e: InputOtpChangeEvent) =>
                  setOtp(e.value ? e.value : "")
                }
                length={6}
                style={{ gap: 0 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => setStep(PASSWORD_RESET_STEPS.REQUEST_OTP)}
              className="text-teal-800 hover:text-teal-700 duration-300 disabled:text-gray-300 text-start text-sm"
            >
              Resend code
            </button>
            <LoadingButton
              fullWidth
              disabled={
                !Boolean(formData.password) ||
                !Boolean(`${otp}`.length === 6) ||
                formData.password !== formData.confirm_password
              }
              loadingIndicator={
                <CircularProgress
                  sx={{
                    color: "rgba(107, 114, 128, 1)",
                  }}
                  size={30}
                />
              }
              loading={loading}
              type="submit"
              sx={{
                ...MUI_STYLES.Button,
                whiteSpace: "nowrap",
                color: "white",
                margin: 0,
                "&.Mui-disabled": {
                  backgroundColor: "rgba(209, 213, 219, .7)",
                },
              }}
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
