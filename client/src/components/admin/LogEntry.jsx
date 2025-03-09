import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const LogEntry = ({ log }) => {
  const timestamp = new Date(log.timestamp).toLocaleString();
  
  // Convert status code to severity
  const getStatusColor = (status) => {
    if (status >= 500) return 'error';
    if (status >= 400) return 'warning';
    if (status >= 200 && status < 300) return 'success';
    return 'default';
  };

  const formatDetails = (details) => {
    try {
      if (typeof details === 'string') {
        details = JSON.parse(details);
      }
      
      // Handle nested JSON strings (common in responseData)
      if (details.responseData && typeof details.responseData === 'string') {
        details = {
          ...details,
          responseData: JSON.parse(details.responseData)
        };
      }
      
      return JSON.stringify(details, null, 2);
    } catch (error) {
      console.error('Error formatting details:', error);
      return JSON.stringify(details, null, 2); // Fallback to basic formatting
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
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
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

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {log.route}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {log.user && (
            <Chip 
              label={`User: ${getUserDisplay(log.user)}`} 
              size="small" 
              variant="outlined"
            />
          )}
          {log.role && (
            <Chip 
              label={`Role: ${log.role}`} 
              size="small" 
              variant="outlined"
            />
          )}
          <Chip 
            label={`IP: ${log.ip}`} 
            size="small" 
            variant="outlined"
          />
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {log.query && Object.keys(log.query).length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Query Parameters:</Typography>
                <pre>{JSON.stringify(log.query, null, 2)}</pre>
              </Box>
            )}
            
            {log.body && Object.keys(log.body).length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Request Body:</Typography>
                <pre>{JSON.stringify(log.body, null, 2)}</pre>
              </Box>
            )}

            {log.details && (
              <Box>
                <Typography variant="subtitle2">Response Data:</Typography>
                <pre style={{ 
                  maxHeight: '400px', 
                  overflow: 'auto', 
                  backgroundColor: '#f5f5f5', 
                  padding: '8px',
                  borderRadius: '4px'
                }}>
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
