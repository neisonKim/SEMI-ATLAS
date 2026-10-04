# SEMI-ATLAS v1.18 · Mobile Contact / Kakao Share

## Mobile contact dialog
- Mobile modal height limited to 76dvh / 620px.
- Compact 390px rule limited to 74dvh / 580px.
- Dialog header is sticky, so the close button remains visible while the form scrolls.
- Name autofocus uses preventScroll to avoid opening the dialog already scrolled past its header.
- Input and textarea heights are compacted on mobile.

## Kakao / social link preview
- Home Open Graph metadata now includes explicit og:title, og:description, og:image and absolute production URLs.
- Twitter summary metadata is included as a fallback for other social clients.
- Representative image: /assets/hero-fab.webp (1672x941).
- After deployment, Kakao may continue to show cached preview data; reset the URL metadata cache in Kakao Developers if needed.
