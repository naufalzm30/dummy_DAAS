# DATA AS SERVICE MONITORING

## Overview

DATA AS SERVICE MONITORING is a web application developed for PDAM Surya Sembada, the local water supply utility located in Surabaya, Indonesia. This application is designed to monitor and manage debit data from multiple water stations across the city.

The system integrates with Data Loggers that automatically record flow data using Flowmeter sensors installed at various stations. Currently, the application manages data from tens of stations, with the capability to scale as more stations are added.

## Features

### Dashboard Page
- Running text for important announcements
- Interactive map showing all station locations
- Table displaying the latest data from each station
- Charts visualizing debit and totalizer data

### Stations Page
- Add, edit, and view detailed information for all stations
- Filter data by date range
- View data summaries
- Download capabilities:
  - All data
  - Daily data
- Upload functionality:
  - Threshold files
  - Sensor data files
- Forecasting (Taksasi) features:
  - Define forecasting data
  - Approve forecasting data based on app-generated models
- Multiple data visualization charts:
  - Flowmeter
  - Taksasi (Forecasting)
  - Totalizer
  - Total Data
  - Percentage Data
  - Total Maintenance
- Data verification tools

### User Management Page
- Add, edit, and delete user accounts
- Manage user roles and permissions

### Notification Page
- Record and display all anomaly data, including:
  - Data outside defined thresholds
  - Maintenance alerts
  - Low Data Logger power warnings

## Technical Details

The DATA AS SERVICE MONITORING web application is built using Python (Django) for the backend and Vue.js for the frontend.

## Project Setup

1. Make sure you have Node.js and npm installed on your machine.
2. Clone this repository and navigate to the client directory.
3. Run the following command to install project dependencies:

```sh
npm install
```

To build the project for production, use:

```sh
npm run build
```

## Configuration

### Changing baseURL

If you need to change the baseURL for API requests, modify the .env file:

VUE_APP_API_URL=http://213.210.21.73:8001/api

### Pushing to GitHub

1. Check the current GitHub repository URL, run:

```sh
git init
```

```sh
git remote show origin
```

2. Change the repository URL to the desired one:

```sh
git remote set-url origin [new-repo-url]
```
```sh
`https://github.com/FurqonAndika/braja_pdamsby_fe.git`
```
3. Check the current GitHub repository URL
```sh
git remote show origin
```

4. After making changes, follow these steps to push to GitHub:

```sh
npm run build
git add .
git status
git commit -m 'major update'
git push -u origin master
```
If the push fails, you can try:
```sh
git push -f origin master
```
