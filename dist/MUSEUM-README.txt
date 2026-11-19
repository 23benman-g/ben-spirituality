BECOMING: ZERO-GRAVITY MUSEUM — DROP-IN VERCEL PACKAGE

This ZIP is the original uploaded site plus a separate museum.html page.
Existing scripts, styles, particle garden, particle grid, and theme sections are retained.

UPLOAD: In Vercel, deploy this ZIP as your updated static site (or upload the extracted folder to your repository). The existing vercel.json points to dist/.

OPEN: index.html -> '3D MUSEUM' in the navigation, or the hero's 'ENTER THE ZERO-GRAVITY MUSEUM' link.

EDIT YOUR CONTENT:
  dist/artworks.js
  Replace each title, creator, description, reflection, concepts, connection.
  Add your own images in dist/artworks/ and set image: './artworks/filename.jpg'.
  Do not use stock or AI-generated artwork for the assignment.

TECHNICAL:
  The museum is independent of the original site's JavaScript.
  Three.js loads from jsDelivr at runtime; the museum requires an internet connection.
  Browsers without WebGL or without access to Three.js get an artwork-list fallback.
  On capable devices, the artwork is rendered as true 3D geometry.
  Camera movement, floating frames, click-to-reveal and close animations are included.
  Motion is reduced when the user's OS requests reduced motion.
  Test on your deployed Vercel URL, not a file:// URL.

NOTE: The old Identity/Doubt/Service reflection editor and its saved text were deliberately left unchanged to avoid overwriting your existing content. The new museum uses Time & Presence, Awe & Beauty, Human Connection.
