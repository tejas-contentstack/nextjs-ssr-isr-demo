export const Home = () => {

  if(process.env.BREAK == 'true'){ 
    throw new Error('throwing an error');
  }
  return (
    <div >
      <p>Home Page</p>
    </div>
  )
}
export default Home
