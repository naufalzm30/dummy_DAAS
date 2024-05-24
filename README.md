# WEATHER VUE

## Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Project Setup](#project-setup)
- [Configuration](#configuration)
  - [Changing baseURL](#changing-baseurl)
  - [Pushing to GitHub](#pushing-to-github)

## Description

The **WEATHER VUE** is an application designed to monitor water level changes in rivers, rainfall, and weather data across all areas under WEATHER VUE. The app provides real-time data and records measurements every 5 minutes for each monitoring station. It also includes a wind rose diagram to visualize weather patterns and a dashboard that offers insights into the last 24 hours of data.

## Key Features

- **Real-time Monitoring**: Monitor water level, rainfall, and weather data in real-time from various stations.
- **Data Logging**: The application logs data every 5 minutes, ensuring precise analysis and trend detection.
- **Wind Rose Diagram**: Visualize wind direction and speed from weather stations using the wind rose diagram.
- **Interactive Map**: View the locations of each monitoring station on an interactive map.
- **Dashboard**: Monitor real-time data and trends for the past 24 hours through an intuitive dashboard.
- **User Management**: Control access and permissions using a comprehensive user management system.
- **Station Management**: Administrators can easily add, update, or remove monitoring stations.
- **Custom Sensor Configuration**: Configure specific sensors for each station, allowing for customization.
- **Data Reporting**: Generate reports for each station based on custom time intervals.

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

If you need to change the baseURL for API requests, modify the following files:

1. In `~/client/src/axios-api.js`, Update the `baseURL` in this file for Axios requests.
2. In `weather_project/client/src/main.js`, Change the `baseURL` in the Vue prototype.
3. in `index.html`, update the <title> to reflect your project's title.
4. In `login.vue`, change the `import bg_img` to use your preferred background image.
5. In `main.js`, modify `Vue.prototype.$fixedBalai` as needed.

### Pushing to GitHub

1. Check the current GitHub repository URL, run:

```sh
git remote show origin
```

2. Change the repository URL to the desired one:

```sh
git remote set-url origin [new-repo-url]
```
```sh
a. `https://github.com/AgusRaharja69/weather_client_bbws8` for bbws viiii
b. `https://github.com/AgusRaharja69/weather_client_bali_penida` for bws bali
c. `https://github.com/AgusRaharja69/weather_client.git` for weather-vue
```
Check the current GitHub repository URL
```sh
git remote show origin
```

3. Update Files
   `index.html`, update the <title> and icon to reflect your project's title and icon.

4. To build the app, run the following command:
```sh
npm run build
```

5. After making changes, follow these steps to push to GitHub:

```sh
git add .
git status
git commit -m 'major update'
git push -u origin main
```
If the push fails, you can try:
```sh
git push -f origin main
```
