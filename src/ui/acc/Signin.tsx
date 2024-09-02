import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { KitongaColorScheme, MUI_STYLES } from "../../lib/MUI_STYLES";
import {
  Alert,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  MailOutlineOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { NavLink, useNavigate } from "react-router-dom";

export function Signin() {
  const navigate = useNavigate();
  const { startLoading, stopLoading, loading } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identity: "admin",
    password: "password",
    grant_type: "client",
  });
  const [error, setError] = useState("");

  const reset = () => {
    setFormData({
      identity: "",
      password: "",
      grant_type: "client",
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startLoading();
    axiosPost(APIS.account.login, formData)
      .then((_res) => {
        setError("");
        reset();
        navigate("/dashboard");
      })
      .catch((err) => {
        if (err?.response?.data) {
          setError(err.response.data.error);
        } else {
          setError(err.message);
        }
      })
      .finally(() => stopLoading());
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-xs flex-grow mx-auto p-4">
        <div className="">
          <img className="w-full" src="/assets/undraw_sign_in.svg" />
        </div>
        <div className="p-2 grid gap-4">
          <h3 className="font-bold text-teal-800">Signin</h3>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <TextField
                size="small"
                value={formData.identity}
                onChange={handleChange}
                sx={{ ...MUI_STYLES.FilledInputTextField2 }}
                variant="filled"
                margin="none"
                required
                fullWidth
                id="identity"
                label="Email Address"
                name="identity"
                autoComplete="identity"
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="email icon" edge="end">
                        <MailOutlineOutlined
                          sx={{ color: KitongaColorScheme.teal800 }}
                          fontSize="small"
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                size="small"
                value={formData.password}
                onChange={handleChange}
                sx={MUI_STYLES.FilledInputTextField2}
                variant="filled"
                margin="none"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff
                            sx={{ color: KitongaColorScheme.teal800 }}
                            fontSize="small"
                          />
                        ) : (
                          <Visibility
                            sx={{ color: KitongaColorScheme.teal800 }}
                            fontSize="small"
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <div className="flex items-center gap-2 text-sm justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.grant_type === "user"}
                    onChange={(_, checked) =>
                      setFormData((p) => ({
                        ...p,
                        grant_type: checked ? "user" : "client",
                      }))
                    }
                    size="small"
                    sx={MUI_STYLES.CheckBox}
                  />
                  <span className="">Administrator</span>
                </div>
                <NavLink
                  to="/forgot-password"
                  className="hover:text-teal-700 text-teal-800 cursor-pointer"
                >
                  Forgot Password?
                </NavLink>
              </div>

              <div className="">
                <LoadingButton
                  loading={loading}
                  sx={{
                    ...MUI_STYLES.Button,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Sign In
                </LoadingButton>
              </div>
            </div>
          </form>

          <div className="text-center mt-4 text-sm">
            Don't have an account?&nbsp;
            <NavLink
              to="/sign-up"
              className="hover:text-teal-700 text-teal-800 cursor-pointer"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
