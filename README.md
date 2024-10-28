# Refresh Token Implementation with Next.js and Axios Interceptors

This repository demonstrates how to implement a refresh token flow in a Next.js application using Axios interceptors. It handles token refresh logic and concurrency issues, ensuring a smooth authentication experience.

## Features

- **Automatic Token Refresh**: Intercepts 403 responses to refresh expired access tokens.
- **Concurrency Handling**: Ensures only one token refresh occurs even with multiple simultaneous requests.
- **Retry Mechanism**: Retries original requests after obtaining a new access token.
- **Token Management**: Stores and updates access and refresh tokens using `localStorage`.
