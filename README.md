# Egg Timer

EggTimer is a simple and visually appealing desktop timer application built using Electron. It allows users to set and run timers, making it ideal for tasks like boiling eggs, studying, or managing work intervals.

## Features

- Minimal, custom-framed window with stylish Comic Neue font
- Custom minimize and close controls
- Visual assets for different timer states (e.g., Hardboiled, Softboiled, Poached eggs)
- Alarm sound notification
- Cross-platform support via Electron

## How It Works

- The application window includes custom controls for minimize and close.
- Click the timer buttons to start different timer presets for eggs (e.g., Softboiled, Hardboiled).
- The timer will notify you with a sound (alarm.mp3) and bring the window to the front when time is up, even if the window was minimized.

## Screenshots

Below are some screenshots of EggTimer in action:

<img width="603" height="602" alt="Screenshot 2025-07-16 at 7 53 29 PM" src="https://github.com/user-attachments/assets/fca303fb-fcfc-4d81-8101-5dfc7b5fcc7b" />

*Main welcome screen with "Start" button.*

<img width="603" height="602" alt="Screenshot 2025-07-16 at 7 53 39 PM" src="https://github.com/user-attachments/assets/db015931-6ab5-4df5-8cce-82fd8f51f8a7" />

*Choose your egg type and timer preset.*

<img width="603" height="602" alt="Screenshot 2025-07-16 at 7 54 14 PM" src="https://github.com/user-attachments/assets/3d8dd15e-5b5b-4c2e-98d1-6e8fa5cce48c" />

*Timer running for selected egg type (Soft Boiled shown).*

<img width="603" height="602" alt="Screenshot 2025-07-16 at 7 57 29 PM" src="https://github.com/user-attachments/assets/608f01ab-6837-4616-8a0c-ac2de5900f7a" />

*Timer finished! "Time's up" screen with alarm sound and window brought to front.*

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/seuho/EggTimer.git
   cd EggTimer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app:**
   ```bash
   npm start
   ```

## Usage

- The application window includes custom controls for minimize and close.
- Click the timer buttons to start different timer presets for eggs (Soft Boiled, Medium Boiled, Hard Boiled, Poached).
- Once the timer hits 0, you will hear an alarm tone and the window will show up in the foreground even after minimizing it.

## File Structure

- `main.js` – Main Electron process; creates the application window and handles window controls/events.
- `preload.js` – Exposes secure APIs to the renderer for window control.
- `index.html` – Main UI of the timer app.
- `components/renderer.js` – Handles UI rendering (referenced in `index.html`).
- `assets/` – Contains SVG and JPG icons for app controls and egg types, plus the alarm sound.
- `styles/` – CSS files for styling the app.

## Scripts

- `npm start` – Launches the Electron app.

## Dependencies

- [electron](https://www.npmjs.com/package/electron)
- [@electron/remote](https://www.npmjs.com/package/@electron/remote)

## License

This project is licensed under the ISC License - see the [LICENSE](./LICENSE) file for details.
