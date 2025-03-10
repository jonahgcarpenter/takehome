import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const LogEntry = ({ log }) => {
  // Format timestamp without seconds for a cleaner look
  const timestamp = new Date(log.timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  // Convert status code to severity
  const getStatusColor = (status) => {
    if (status >= 500) return "error";
    if (status >= 400) return "warning";
    if (status >= 200 && status < 300) return "success";
    return "default";
  };

  const formatDetails = (details) => {
    try {
      if (typeof details === "string") {
        const trimmed = details.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          details = JSON.parse(trimmed);
        } else {
          return trimmed;
        }
      }
      if (
        details &&
        details.responseData &&
        typeof details.responseData === "string"
      ) {
        const trimmedResponse = details.responseData.trim();
        if (
          trimmedResponse.startsWith("{") ||
          trimmedResponse.startsWith("[")
        ) {
          details = {
            ...details,
            responseData: JSON.parse(trimmedResponse),
          };
        }
      }
      return JSON.stringify(details, null, 2);
    } catch (error) {
      console.error("Error formatting details:", error);
      return typeof details === "string"
        ? details
        : JSON.stringify(details, null, 2);
    }
  };

  const getUserDisplay = (user) => {
    if (!user) return "Unknown User";
    if (typeof user === "object" && user.displayName) {
      return user.displayName;
    }
    return user;
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: "#333", color: "#eee" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="primary.main">
            {timestamp}
          </Typography>
          <Box>
            <Chip
              label={log.method}
              size="small"
              color="primary"
              sx={{ mr: 1 }}
            />
            <Chip
              label={`${log.responseStatus}`}
              size="small"
              color={getStatusColor(log.responseStatus)}
            />
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1, color: "primary.main" }}>
          {log.route}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          {log.user && (
            <Chip
              label={`User: ${getUserDisplay(log.user)}`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#555",
                color: "#eee",
              }}
            />
          )}
          {log.role && (
            <Chip
              label={`Role: ${log.role}`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#555",
                color: "#eee",
              }}
            />
          )}
          <Chip
            label={`IP: ${log.ip}`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: "#555",
              color: "#eee",
            }}
          />
        </Box>

        <Accordion sx={{ backgroundColor: "#444", color: "#eee" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#eee" }} />}
          >
            <Typography>Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {log.query && Object.keys(log.query).length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Query Parameters:</Typography>
                <pre
                  style={{
                    backgroundColor: "#555",
                    padding: "8px",
                    borderRadius: "4px",
                    color: "#eee",
                  }}
                >
                  {JSON.stringify(log.query, null, 2)}
                </pre>
              </Box>
            )}

            {log.body && Object.keys(log.body).length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Request Body:</Typography>
                <pre
                  style={{
                    backgroundColor: "#555",
                    padding: "8px",
                    borderRadius: "4px",
                    color: "#eee",
                  }}
                >
                  {JSON.stringify(log.body, null, 2)}
                </pre>
              </Box>
            )}

            {log.details && (
              <Box>
                <Typography variant="subtitle2">Response Data:</Typography>
                <pre
                  style={{
                    maxHeight: "400px",
                    overflow: "auto",
                    backgroundColor: "#555",
                    padding: "8px",
                    borderRadius: "4px",
                    color: "#eee",
                  }}
                >
                  {formatDetails(log.details)}
                </pre>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LogEntry;
