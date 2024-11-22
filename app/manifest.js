export default function manifest() {
  return {
    name: 'Alex Berkowitz',
    short_name: 'Berkowitz',
    description: 'Designer, Developer, Maker',
    start_url: '/',
    display: 'standalone',
    background_color: '#ff2b06',
    theme_color: '#ff2b06',
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