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

/**
 * LogEntry Component - Displays a single log entry with expandable details
 * @param {Object} props
 * @param {Object} props.log - The log entry object containing all log information
 * @param {string} props.log.timestamp - ISO timestamp of the log entry
 * @param {string} props.log.method - HTTP method used (GET, POST, etc.)
 * @param {number} props.log.responseStatus - HTTP response status code
 * @param {string} props.log.route - API route that was accessed
 * @param {Object|string} props.log.user - User information
 * @param {string} props.log.role - User's role
 * @param {string} props.log.ip - IP address of the request
 * @param {Object} [props.log.query] - Query parameters if present
 * @param {Object} [props.log.body] - Request body if present
 * @param {Object|string} [props.log.details] - Response details/data
 */
const LogEntry = ({ log }) => {
  /**
   * Formats the timestamp to a more readable format without seconds
   */
  const timestamp = new Date(log.timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  /**
   * Determines the severity color based on HTTP status code
   * @param {number} status - HTTP status code
   * @returns {string} MUI color designation
   */
  const getStatusColor = (status) => {
    if (status >= 500) return "error";
    if (status >= 400) return "warning";
    if (status >= 200 && status < 300) return "success";
    return "default";
  };

  /**
   * Formats and parses the details object/string for display
   * Handles nested JSON strings and complex object structures
   * @param {Object|string} details - The details to format
   * @returns {string} Formatted string representation of the details
   */
  const formatDetails = (details) => {
    try {
      // Check if details is a string and parse it if it looks like JSON
      if (typeof details === "string") {
        const trimmed = details.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          details = JSON.parse(trimmed);
        } else {
          return trimmed;
        }
      }
      // If details is an object, check if responseData is a string and parse it
      if (
        details &&
        details.responseData &&
        typeof details.responseData === "string"
      ) {
        const trimmedResponse = details.responseData.trim();
        // Check if the responseData is a JSON string
        if (
          trimmedResponse.startsWith("{") ||
          trimmedResponse.startsWith("[")
        ) {
          // Parse the JSON string and update details
          details = {
            ...details,
            responseData: JSON.parse(trimmedResponse),
          };
        }
      }
      return JSON.stringify(details, null, 2);
    } catch (error) {
      // Handle any errors during parsing
      console.error("Error formatting details:", error);
      return typeof details === "string"
        ? details
        : JSON.stringify(details, null, 2);
    }
  };

  /**
   * Extracts user display name from user object or string
   * @param {Object|string} user - User information
   * @returns {string} User display name
   */
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
        {/* Header Section - Timestamp and Request Info */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          {/* Display timestamp */}
          <Typography variant="body2" color="primary.main">
            {timestamp}
          </Typography>

          {/* Display method and status code */}
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

        {/* Route Information */}
        <Typography variant="subtitle1" sx={{ mb: 1, color: "primary.main" }}>
          {log.route}
        </Typography>

        {/* User Information Section */}
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

        {/* Expandable Details Section */}
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
