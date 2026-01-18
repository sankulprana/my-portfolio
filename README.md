# My Portfolio

A modern, interactive personal portfolio website built with HTML, CSS, and JavaScript featuring a stunning animated background and smooth animations.

## Features

- **Interactive Canvas Background**: Dynamic particle system with mouse interaction
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Smooth Animations**: Elegant fade-in effects and transitions throughout
- **Modern Styling**: Dark theme with gold accents and gradient effects
- **Sticky Navigation**: Easy navigation that stays accessible while scrolling
- **Hero Section**: Eye-catching introduction with animated text

## Technologies Used

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Interactive features including:
  - Canvas-based particle system
  - Mouse event handling
  - Window focus/blur detection
  - Responsive canvas resizing

## Project Structure

```
portfolio_project/
├── index.html      # Main HTML file with page structure
├── fun.js          # JavaScript for interactive canvas and animations
├── style.css       # CSS styling (embedded in HTML)
└── README.md       # Project documentation
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies or installations required

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. The portfolio will load with all interactive features enabled

## Usage

- **Navigate**: Use the sticky navigation menu at the top to jump between sections
- **Interact**: Move your mouse over the canvas background to interact with particles
- **Explore**: Scroll through the portfolio to view all sections

## Key Components

### Interactive Canvas
The `InteractiveCanvas` class in `fun.js` creates an animated particle system that:
- Generates 100 floating particles with random properties
- Detects mouse movement and creates repulsion effects
- Automatically pauses animations when the window loses focus
- Adapts to window resizing

### Animations
- Fade-in animations on page load
- Smooth hover transitions on navigation links
- Particle movement with physics simulation
- Gradient background animations

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Add project showcase section with filters
- Integrate contact form
- Add dark/light theme toggle
- Implement lazy loading for images
- Add sound effects for interactions

## License

This project is open source and available for personal use.

## Author

Created as a modern portfolio website to showcase web development skills.
