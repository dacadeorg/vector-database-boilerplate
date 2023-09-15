// file: /pages/_app.js
import "react-mde/lib/styles/css/react-mde-all.css";
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
