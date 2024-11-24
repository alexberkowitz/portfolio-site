export default function manifest() {
  return {
    name: 'Alex Berkowitz',
    short_name: 'Alex Berkowitz',
    description: 'Designer, Developer, Maker',
    start_url: '/',
    // display: 'standalone',
    background_color: '#dbd8ce',
    theme_color: '#dbd8ce',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: "/apple-icon.png",
        sizes: "1024x1024",
        type: "image/png"
      }
    ],
  }
}