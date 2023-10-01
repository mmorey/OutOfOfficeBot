# OutOfOfficeBot

OutOfOfficeBot is designed for teams using a shared Google Calendar on Google Workspace to track Paid Time Off (PTO) and out-of-office statuses. This script automates the process of sending daily notifications to a designated Slack channel—like `#general` or `#attendance`—to keep everyone informed about who's out for the day. Whether it's for vacation, a doctor's appointment, or any other reason, OutOfOfficeBot helps maintain clear communication about team availability.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)

## Features

- Automated daily notifications in Slack about who is out of the office.
- Supports both all-day and timed events.
- Only runs on workdays (Monday through Friday).
- Easy to set up and configure.

## Installation

1. Clone this repository.
2. Open [Google Apps Script](https://www.google.com/script/start/) Editor and create a new project.
3. Copy the script files into the Apps Script Editor.
4. Set up the necessary script properties (`calendarId`, `calendarUrl`, `webhookUrl`).

## Usage

1. Run `setProperties` function once to initialize the script properties.
2. Schedule `postToSlack` to run daily using Google Apps Script's built-in triggers.

## Configuration

You'll need to set the following script properties:

- `calendarId`: The ID of your Google Calendar.
- `calendarUrl`: The URL of your Google Calendar.
- `webhookUrl`: The Slack Webhook URL for posting notifications. To set up a Slack Webhook, follow the [Slack documentation](https://api.slack.com/messaging/webhooks).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
