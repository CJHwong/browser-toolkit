# Scrum Poker

A real-time collaborative planning poker tool for agile teams.

## Features

- Real-time session sharing with multiple participants
- Planning poker cards (0, 1, 2, 3, 5, 8, 13, 21, ?, ☕)
- Vote reveal and suggestion system
- QR code sharing for easy mobile access
- Bookmarklet for quick access from any webpage
- Session creator can remove disruptive participants

## Setup

1. **Firebase Configuration**: Copy `firebase-config.json.example` to `firebase-config.json` and add your Firebase project details.

2. **Firebase Security Rules**: Deploy the database rules using Firebase CLI:

   ```bash
   firebase deploy --only database
   ```

## Firebase Rules Deployment

The project includes Firebase security rules in `database.rules.json`. To deploy:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize (if needed): `firebase init`
4. Deploy rules: `firebase deploy --only database`

### Rules Overview

- **Authentication**: All operations require authentication
- **Session Structure**: Validates required fields (users, isRevealed, creatorId)
- **User Data**: Validates name length, vote values, and boolean flags
- **Vote Validation**: Only allows valid poker card values
- **Data Integrity**: Prevents unexpected fields with `$other` validation

## Usage

1. Create a session with your name
2. Share the session URL or QR code with team members
3. Participants join and vote on story points
4. Session creator reveals votes when ready
5. Use the suggestion feature for guidance on final estimates

## Bookmarklet

Generate a bookmarklet to quickly access the session from any webpage in a side panel.
