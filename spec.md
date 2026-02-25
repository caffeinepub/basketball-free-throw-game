# Basketball Free Throw Game

## Overview
A simple 2D basketball free throw game where players shoot basketballs toward a hoop to score points with realistic trajectory mechanics.

## Core Features

### Game Mechanics
- 2D game with basketball court background and visible hoop positioned on the right side of the court
- Basketball object that moves with parabolic motion physics when shot toward the hoop
- Shoot button to launch the basketball with adjustable power and angle
- Trajectory calculation system that determines shot success based on power and angle alignment with hoop area
- Hit detection with tolerance range to determine when ball successfully goes through the hoop
- Ball physics that show realistic bouncing or missing when shots fail
- Success animation when ball goes through the hoop

### Scoring System
- Awards +1 point for each successful shot through the hoop
- Brief success message display for made shots
- Score tracking throughout the game session

### User Interface
- Current score display prominently on screen
- Shoot button for initiating throws with power/angle control
- Reset Game button to restart and clear score
- Success message notifications for made shots
- Clean, colorful, and responsive design for desktop and mobile devices

### Game State
- All game state (score, ball position, trajectory, game status) managed in frontend
- No backend data persistence required
- Game resets to initial state when Reset Game button is pressed

## Technical Requirements
- Frontend-only application with no backend data storage
- Responsive design supporting both desktop and mobile interactions
- Smooth animation for ball trajectory using parabolic motion calculations
- Trajectory physics that account for power and angle to determine hoop success
- Visual feedback for successful and missed shots
