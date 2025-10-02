# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML/CSS/JavaScript website for Sean Tech Consulting, hosted on GitHub Pages at seantech.co.

### Tech Stack Summary
- **Frontend**: Pure HTML5, CSS3, JavaScript (jQuery-based)
- **Styling**: Bootstrap CSS framework + custom CSS
- **JavaScript Libraries**: jQuery 1.11.3, Bootstrap, Owl Carousel, Magnific Popup, Masonry
- **Backend**: PHP (for contact form processing)
- **Hosting**: GitHub Pages (domain: seantech.co)
- **Version Control**: Git (currently on gh-pages branch)

## Project Structure

```
C:\Repos\Sean\seantech\
├── index.html              # Main homepage
├── blog.html              # Blog listing page
├── blog_single.html       # Individual blog post template
├── project_single.html    # Project detail template
├── send.php              # Contact form handler (PHP)
├── CNAME                 # Custom domain configuration (seantech.co)
├── LICENSE               # Project license
├── README.md             # Basic project readme
├── css/                  # Stylesheets
│   ├── bootstrap.css     # Bootstrap framework
│   ├── main.css          # Primary custom styles
│   ├── base.css          # Base styles
│   ├── font.css          # Font definitions
│   ├── magnific-popup.css # Popup plugin styles
│   └── owl-carousel/     # Carousel plugin styles
├── js/                   # JavaScript files
│   ├── jquery-1.11.3.min.js # jQuery library
│   ├── bootstrap.min.js  # Bootstrap JS
│   ├── script.js         # Main custom JavaScript
│   ├── owl.carousel.js   # Carousel functionality
│   ├── jquery.magnific-popup.js # Image popup
│   ├── masonry.min.js    # Grid layout
│   └── [other plugins]   # Various jQuery plugins
├── img/                  # Image assets
│   ├── portfolio/        # Portfolio images
│   ├── blog/            # Blog images
│   ├── testimonial/     # Testimonial photos
│   ├── parallax/        # Background images
│   └── [other folders]  # Various image categories
├── font/                # Custom fonts
└── files/               # Document files
    ├── resume.pdf       # Sean's resume
    └── Readme.md        # Files directory info
```

## Key Features & Functionality

### 1. Homepage (index.html)
- Hero section with professional introduction
- Services showcase
- Portfolio grid with filtering
- Team/about section
- Client testimonials carousel
- Contact form with validation
- Smooth scrolling navigation
- Responsive design

### 2. Blog System
- Blog listing page (blog.html)
- Individual post template (blog_single.html)
- Static HTML-based blog posts

### 3. JavaScript Functionality (script.js)
- **Sticky Navigation**: Header changes on scroll
- **Smooth Scrolling**: Animated page navigation
- **Image Galleries**: Magnific Popup for portfolio items
- **Carousels**: Owl Carousel for clients and testimonials
- **Portfolio Filtering**: Dynamic content filtering
- **Form Validation**: Client-side contact form validation
- **Mobile Menu**: Responsive navigation
- **Loading Animation**: Site preloader
- **Masonry Layout**: Grid-based content arrangement

### 4. Contact Form (send.php)
- Server-side PHP form processing
- Email validation and injection protection
- Sends emails to: support@seantech.co
- AJAX submission with success/error handling

## Development Guidelines

### File Management
- **Static Site**: No build process or package manager
- **Direct Editing**: Modify HTML/CSS/JS files directly
- **Assets**: All images stored in organized /img/ subdirectories
- **Deployment**: Files are served directly from gh-pages branch

### CSS Architecture
- **Bootstrap Base**: Uses Bootstrap 3.x for grid and components
- **Custom Styles**: main.css contains site-specific styling
- **Modular CSS**: Separate files for different concerns (fonts, base, main)
- **Responsive**: Mobile-first responsive design principles

### JavaScript Architecture
- **jQuery-Based**: All functionality built on jQuery 1.11.3
- **Plugin-Heavy**: Uses multiple jQuery plugins for functionality
- **Modular**: Each major feature has dedicated code sections
- **Event-Driven**: Heavy use of DOM events and animations

### Image Management
- **Organized Structure**: Images sorted by purpose in subfolders
- **Optimization**: Images should be web-optimized for performance
- **Lazy Loading**: Background images loaded via JavaScript
- **Responsive**: Consider different screen sizes

## Important Notes for AI Assistants

### Hosting & Domain
- **GitHub Pages**: Site hosted on gh-pages branch
- **Custom Domain**: seantech.co (configured via CNAME)
- **Branch Strategy**: gh-pages is the main deployment branch

### PHP Limitations
- **GitHub Pages**: Does not support PHP execution
- **Contact Form**: send.php won't work on GitHub Pages hosting
- **Alternative Needed**: Consider Netlify, Vercel, or form services like Formspree

### Maintenance Considerations
- **Legacy jQuery**: Using older jQuery version (1.11.3)
- **Bootstrap Version**: Using Bootstrap 3.x (not latest)
- **Mobile Compatibility**: Ensure changes maintain responsive design
- **Cross-Browser**: Test across different browsers

### Content Updates
- **Static Content**: All content is hardcoded in HTML
- **Portfolio**: Update portfolio section by modifying HTML directly
- **Blog Posts**: Add new blog posts by creating new HTML files
- **Images**: Add new images to appropriate /img/ subdirectories

### No Existing AI Rules
- **No .cursorrules**: No existing Cursor AI rules found
- **No Copilot Instructions**: No GitHub Copilot configuration found
- **Clean Slate**: This is the first AI assistant documentation

## Recommended Development Workflow
1. Make changes to HTML/CSS/JS files directly
2. Test locally by opening HTML files in browser
3. Commit changes to gh-pages branch
4. Changes automatically deploy to seantech.co
5. No build process or compilation needed

## Contact Form Alternative Solutions
Since PHP won't work on GitHub Pages, consider:
- **Formspree**: Simple form handling service
- **Netlify Forms**: If migrating to Netlify
- **EmailJS**: Client-side email sending
- **Google Forms**: Embedded form solution

---

*This documentation was generated for AI assistants to understand the Sean Tech Consulting website codebase structure and development approach.*