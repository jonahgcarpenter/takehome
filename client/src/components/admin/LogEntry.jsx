import React from "react";
import { Card, CardContent, Typography, Divider } from "@mui/material";

const LogEntry = ({ log }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {log.method} {log.route}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          User: {log.user} | Role: {log.role} | IP: {log.ip}
        </Typography>
        <Typography variant="body2">
          <strong>Response Status:</strong> {log.responseStatus}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1">Headers:</Typography>
        <pre style={{ overflowX: "auto", fontSize: "0.8rem" }}>
          {JSON.stringify(log.headers, null, 2)}
        </pre>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1">Details:</Typography>
        <pre style={{ overflowX: "auto", fontSize: "0.8rem" }}>
          {JSON.stringify(log.details, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

export default LogEntry;
