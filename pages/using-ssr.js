export default function UsingSSR({ time }) {
  return (
    <main>
      <h1>SSR Caching with Next.js</h1>
      <time dateTime={time}>{time}</time>
    </main>
  )
}

export async function getServerSideProps({ req, res }) {
  // res.setHeader("cache-control", "max-age=3600")
  // res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=10, stale-while-revalidate=59'
  // )
  console.log('Hello');
  console.log({obj: 123});
  console.warn("req");
  console.error(req);
  console.log(req.headers);
  console.log(req.body)
  return {
    props: {
      time: new Date().toISOString(),
    },
  }
}
