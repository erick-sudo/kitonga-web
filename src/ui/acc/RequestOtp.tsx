import {
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { axiosPost } from "../../lib/axiosLib";
import { KitongaColorScheme, MUI_STYLES } from "../../lib/MUI_STYLES";
import { MailOutlineOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, FormEvent, useState } from "react";
import { APIS } from "../../lib/apis";
import { ReactState } from "../definitions";

export const RequestOTP = ({
  onSuccess,
  state: [email, setEmail] = useState<string>(""),
}: {
  onSuccess: () => void;
  state?: ReactState<string>;
}) => {
  const [resending, setResending] = useState(false);
  const [getCodeCount, setGetCodeCount] = useState(0);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGetCodeCount(getCodeCount + 1);
    setResending(true);
    axiosPost(APIS.account.getOtp, { email })
      .then(() => {
        onSuccess();
      })
      .catch((axiosError) => {
        setError(
          axiosError?.response?.data?.email?.length
            ? axiosError.response.data.email[0]
            : "Could not process request. Please try again later."
        );
      })
      .finally(() => {
        setResending(false);
      });
  }

  return (
    <div className="grid gap-2">
      <div className="">
        <Typography component="div">
          Please enter your email address to receive a reset code
        </Typography>
      </div>

      <form
        className="flex rounded overflow-hidden bg-black/5 border border-black/5"
        onSubmit={onSubmit}
      >
        <div>
          <TextField
            disabled={resending}
            size="small"
            sx={{
              ...MUI_STYLES.FilledInputTextField2,
              "& .MuiFilledInput-root": {
                backgroundColor: "rgba(0, 0, 0, 0)",
                border: "solid 1px rgba(0, 0, 0, 0)",
                borderRadius: 0,
              },
            }}
            variant="filled"
            required
            fullWidth
            label="Email"
            autoComplete="email"
            value={email}
            onChange={(
              e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setEmail(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="email icon" edge="end">
                    <MailOutlineOutlined
                      sx={{
                        color: KitongaColorScheme.teal800,
                      }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="flex p-1">
          <LoadingButton
            size="small"
            className="bg-gray-500"
            loadingIndicator={
              <CircularProgress
                sx={{
                  color: "rgba(107, 114, 128, 1)",
                }}
                size={20}
              />
            }
            loading={resending}
            type="submit"
            sx={{
              ...MUI_STYLES.Button,
              whiteSpace: "nowrap",
              borderRadius: "4px",
              width: "8rem",
              color: "white",
              margin: 0,
              "&.Mui-disabled": {
                backgroundColor: "rgba(0, 0, 0, .05)",
              },
            }}
          >
            {getCodeCount > 0 ? "Resend" : "Send"}
          </LoadingButton>
        </div>
      </form>
      {error && (
        <div>
          <Alert severity="error">{error}</Alert>
        </div>
      )}
    </div>
  );
};
