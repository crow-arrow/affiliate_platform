import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { themeSettings } from "../data_grid_theme/theme";
import { useMuiMode } from "./useMuiMode";
import PropTypes from "prop-types";
import GlobalStyles from "@mui/material/GlobalStyles";

export const ThemedDataGrid = ({
  rows,
  columns,
  getRowId,
  checkboxSelection,
  disableRowSelectionOnClick,
}) => {
  const mode = useMuiMode();
  const muiTheme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const currentTheme = muiTheme;

  const primaryTextColor = currentTheme.palette.text.primary;
  const secondaryTextColor = currentTheme.palette.text.secondary;
  const accentColor = currentTheme.palette.primary.main;

  // --- ГЛОБАЛЬНЫЕ СТИЛИ ДЛЯ ВСЕХ ВЫПАДАЮЩИХ МЕНЮ ---
  const globalMenuStyles = (
    <GlobalStyles
      styles={{
        ".MuiPaper-root.MuiMenu-paper": {
          backgroundColor: `${currentTheme.palette.secondary.alternative} !important`,
          borderRadius: "10px", // Или 15px, как у вас было
          boxShadow: "none !important",
          "--Paper-overlay": "none !important",
          backgroundImage: "none !important",
          transition: "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
        ".MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1":
          {
            backgroundColor: `${currentTheme.palette.secondary.alternative} !important`,
            borderRadius: "10px", // Или 15px, как у вас было
            boxShadow: "none !important",
            "--Paper-overlay": "none !important",
            backgroundImage: "none !important",
            transition:
              "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          },
        // Целимся в отдельные пункты меню
        ".MuiMenuItem-root": {
          "&:hover": {
            backgroundColor: `${currentTheme.palette.action.selected} !important`,
          },
          "&.Mui-selected": {
            backgroundColor: `${currentTheme.palette.action.selected} !important`,
          },
        },
        // Целимся в иконки внутри меню (например, чекбоксы, радиокнопки, иконки фильтра)
        ".MuiMenuItem-root .MuiSvgIcon-root": {
          color: `${primaryTextColor} !important`,
        },
        ".MuiRadio-root": {
          color: `${primaryTextColor} !important`,
        },
        ".MuiCheckbox-root": {
          color: `${primaryTextColor} !important`,
        },
        // Если есть текст заголовков внутри меню (например, "Sort by", "Filter by")
        ".MuiListSubheader-root": {
          color: `${primaryTextColor} !important`,
        },
        // Стиль для полей ввода внутри меню (если они есть вложенные, например, для поиска)
        ".MuiMenu-paper .MuiInputBase-root": {
          color: `${primaryTextColor} !important`,
          padding: "0 !important",
        },
        ".MuiInputBase-root": {
          padding: "0 !important",
        },
        ".MuiMenu-paper .MuiInputBase-root::after": {
          borderBottomColor: `${accentColor} !important`, // Или любой другой цвет
        },
        ".MuiMenu-paper .MuiInputBase-root:hover::before": {
          borderBottomColor: `${accentColor} !important`,
        },
        ".MuiMenu-paper .MuiInputBase-root::before": {
          borderBottomColor: `${secondaryTextColor} !important`,
        },
        ".MuiMenu-paper .MuiOutlinedInput-notchedOutline": {
          borderColor: `${primaryTextColor} !important`,
        },
        "& .MuiInputLabel-root": {
          color: currentTheme.palette.text.primary + "!important",
        },
        ".MuiInputBase-input": {
          outline: "none !important",
        },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent !important",
          border: "none !important",
        },
        ".MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent !important",
        },
        ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent !important",
        },
        ".MuiInputBase-root::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: `${accentColor} !important`,
          transform: "scaleX(0)",
          transition: "transform 500ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
        },
        // При фокусе:
        ".MuiInputBase-root.Mui-focused::after": {
          transform: "scaleX(1)",
        },
        ".MuiInputBase-root::before": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: `${secondaryTextColor} !important`,
        },
      }}
    />
  );

  return (
    <ThemeProvider theme={muiTheme}>
      {globalMenuStyles} {/* Вставляем глобальные стили */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minWidth: 0,
          height: "100%",
          maxWidth: "100%",
          "& .MuiDataGrid-root": {
            padding: "16px",
            border: "none",
            "--DataGrid-containerBackground":
              currentTheme.palette.secondary.main,
            color: "#87888C !important",
            transition:
              "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          },
          "& .MuiDataGrid-cell": {
            margin: "auto",
            borderTop: "none !important",
            color: currentTheme.palette.text.primary,
          },
          "& .MuiDataGrid-filler": {
            "--DataGrid-rowBorderColor": "none !important",
          },
          "& .MuiDataGrid-columnSeparator": {
            width: "0.5px",
          },
          "& .MuiTablePagination-root, & .MuiButtonBase-root > svg, & .MuiTablePagination-actions > button, & .MuiInputBase-root > svg":
            {
              color: secondaryTextColor,
              fill: secondaryTextColor,
            },
        }}
        className="p-4 rounded-2xl bg-white dark:bg-secondary2 transition-colors duration-300" // Убедитесь, что Tailwind не переопределяет
      >
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          slots={{ toolbar: GridToolbar }}
          getRowId={getRowId}
          slotProps={{
            panel: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor:
                    currentTheme.palette.secondary.alternative + "!important",
                  color: currentTheme.palette.text.primary,
                  borderRadius: "15px",
                  boxShadow: "none",
                  "--Paper-overlay": "none !important",
                },
                "& .MuiInputBase-root::after": {
                  transition:
                    "transform 500ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
                },
              },
            },
          }}
          sx={{
            display: "grid",
            gridTemplateRows: "auto 1f auto",
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

ThemedDataGrid.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  getRowId: PropTypes.func.isRequired,
  checkboxSelection: PropTypes.bool,
  disableRowSelectionOnClick: PropTypes.bool,
};

ThemedDataGrid.defaultProps = {
  checkboxSelection: false,
  disableRowSelectionOnClick: false,
};
