/**
 * Sets the script properties for calendarId, calendarUrl, and webhookUrl.
 * Run this function once to initialize these properties.
 */
function setProperties() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('calendarId', 'your-calendar-id@example.com');
  scriptProperties.setProperty('calendarUrl', 'your-calendar-url');
  scriptProperties.setProperty('webhookUrl', 'your-webhook-url');
}


/**
 * Sends a Slack message listing today's events from a Google Calendar.
 * The function only runs on workdays (Monday through Friday).
 * It fetches events from the Google Calendar specified by the 'calendarId' script property,
 * and sends them to the Slack webhook URL specified by the 'webhookUrl' script property.
 * The message also includes a link to the Google Calendar, specified by the 'calendarUrl' script property.
 */

function postToSlack() {
  // Access the script's properties
  const scriptProperties = PropertiesService.getScriptProperties();
  
  // Retrieve stored properties
  const calendarId = scriptProperties.getProperty('calendarId');
  const calendarUrl = scriptProperties.getProperty('calendarUrl');
  const webhookUrl = scriptProperties.getProperty('webhookUrl');
  
  // Check if properties are set
  if (!calendarId || !calendarUrl || !webhookUrl) {
    console.error('Please set the calendarId, calendarUrl, and webhookUrl in the script properties.');
    return;
  }
  
  // Get today's day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  // Only run the script on workdays (Monday = 1, ..., Friday = 5)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const calendar = CalendarApp.getCalendarById(calendarId);

    // Check if the calendar exists or if the user is authorized
    if (!calendar) {
      console.error('Failed to access the calendar. Make sure the calendarId is correct and you have the necessary permissions.');
      return;
    }
    
    // Get today's events
    const events = calendar.getEventsForDay(now);
    
    // Prepare message for Slack
    let message = '';
    if (events.length === 0) {
      message = 'No one is out of the office today!';
    } else {
      message = 'Out of Office today:\n';
      events.forEach((event) => {
        const startTime = event.getStartTime();
        const endTime = event.getEndTime();
        
        // Convert to Unix timestamp
        const startTimestamp = Math.floor(startTime.getTime() / 1000);
        const endTimestamp = Math.floor(endTime.getTime() / 1000);
        
        // Check if the event is an all-day event
        if (event.isAllDayEvent()) {
          message += `- ${event.getTitle()} (All day)\n`;
        } else {
          // Use Slack's special timestamp formatting
          message += `- ${event.getTitle()} (<!date^${startTimestamp}^{time}|${startTimestamp}> - <!date^${endTimestamp}^{time}|${endTimestamp}>)\n`;
        }
      });
    }
    
    // Add a link to the calendar with shorter text
    message += `\nTo mark your unavailable times, visit the <${calendarUrl}|team calendar>.`;
    
    // Send message to Slack
    const payload = {
      'text': message
    };
    const options = {
      'method': 'post',
      'payload': JSON.stringify(payload)
    };
    try {
      // Send message to Slack
      const response = UrlFetchApp.fetch(webhookUrl, options);
      
      // Check HTTP response code
      if (response.getResponseCode() === 200) {
        console.info('Successfully sent message to Slack.');
      } else {
        console.error(`Failed to send message to Slack. Response code: ${response.getResponseCode()}, Response content: ${response.getContentText()}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error.toString()}`);
    }
  } else {
    console.info('It is the weekend, we only post to Slack on work days.');
  }
}
