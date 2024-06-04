export default function UsingSSR({ time }) {
  return (
    <main>
      <h1>SSR Caching with Next.js</h1>
      <time dateTime={time}>{time}</time>
    </main>
  )
}

export async function getServerSideProps({ req, res }) {
const myObject = {};
myObject.itself = myObject;



  // res.setHeader("cache-control", "max-age=3600")
  // res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=10, stale-while-revalidate=59'
  // )
  console.log('Hello');
  console.log({obj: 123});
  console.log("req");
  console.log(req);
  console.log(req.headers);
  console.log(req.body);
  console.log(myObject); // This will log the object itself, but referencing itself won't show all properties.
  return {
    props: {
      time: new Date().toISOString(),
    },
  }
}
