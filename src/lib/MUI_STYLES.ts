export const KitongaColorScheme = {
  teal950: "rgb(4, 47, 46)",
  teal900: "rgb(19, 78, 74)",
  teal800: "rgb(17, 94, 89)",
  teal700: "rgb(15, 118, 110)",
};

export const MUI_STYLES = {
  OneTimePasswordInput: {
    "& .MuiOtpInput-TextField": {
      "& label.Mui-focused": {
        color: KitongaColorScheme.teal800,
      },
      "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
          borderColor: KitongaColorScheme.teal800,
        },
        "&.Mui-focused fieldset": {
          borderColor: KitongaColorScheme.teal800,
        },
      },
    },
  },
  CheckBox: {
    color: KitongaColorScheme.teal800,
    "&.Mui-checked": {
      color: KitongaColorScheme.teal800,
    },
  },
  TextField: {
    margin: 0,
    "& label.Mui-focused": {
      color: KitongaColorScheme.teal800,
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: KitongaColorScheme.teal800,
        padding: "0",
      },
      "&.Mui-focused fieldset": {
        borderColor: KitongaColorScheme.teal800,
      },
    },
    "& .MuiInputLabel-root": { fontSize: "12px" },
    "& .MuiInputBase-root": { padding: "1px 20px 1px 0" },
    "& .MuiInputBase-input": { fontSize: "12px" },
  },
  FilledInputTextField: {
    "& .MuiFilledInput-root": {
      borderRadius: 0,
    },
    "& label.Mui-focused": {
      color: "black",
    },
    "& .MuiFilledInput-root:hover": {
      // Background color on hover
      backgroundColor: "rgba(4, 47, 46, .1)",
    },
    "& .MuiFilledInput-underline:before": {
      // Underline color
      borderBottomColor: KitongaColorScheme.teal800,
    },
    "& .MuiFilledInput-underline:after": {
      // Color when focused
      borderBottomColor: KitongaColorScheme.teal800,
    },
    "& .MuiFilledInput-underline:hover:before": {
      // Hover color
      borderBottomColor: KitongaColorScheme.teal800,
    },
  },

  FilledInputTextField2: {
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(0, 0, 0, 0)",
      border: "solid 1px rgba(0, 0, 0, .1)",
    },
    "& label.Mui-focused": {
      color: "black",
    },
    "& .MuiFilledInput-root:hover": {
      // Background color on hover
      backgroundColor: "rgba(0, 0, 0, .0)",
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
  },

  SelectField: {
    width: "100%",
    backgroundColor: "white",
    "&:hover": {
      border: "none",
    },
    ".MuiSelect-select": {
      width: "100%",
      border: "solid 2px rgb(4, 47, 46)",
    },
  },

  Avatar: { backgroundColor: KitongaColorScheme.teal800 },

  Button: {
    textTransform: "none",
    margin: "0 0",
    color: "white",
    backgroundColor: KitongaColorScheme.teal800,
    "&:hover": {
      backgroundColor: KitongaColorScheme.teal700,
    },
  },
  DeleteButton: {
    textTransform: "none",
    margin: "0 0",
    color: "white",
    backgroundColor: "rgb(153, 27, 27)",
    "&:hover": {
      backgroundColor: "rgb(220, 38, 38)",
    },
  },
};
